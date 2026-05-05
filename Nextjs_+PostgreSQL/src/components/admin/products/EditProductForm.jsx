"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";
import { X } from "lucide-react";
import FloatingTextArea from "@/components/FloatingTextArea";
import {
  capitalizeEachFirstCharOfWord,
  convertDashStringToTextString,
  getAdminProductIssues,
  handleTextareInput,
} from "@/utils/utilities";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import { useSession } from "next-auth/react";
import { useGlobalToast } from "@/context/GlobalToastContext";
import {
  BaseProductSchema,
  StrictProductSchema,
} from "@/schemas/productSchema";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EditProductForm({
  // session,
  product: initialProduct,
  categories = [],
  allCollections = [],
}) {
  // const { sessionData: session } = useSessionExpiry();
  const { data: session } = useSession();
  const { setToast } = useGlobalToast();

  const router = useRouter();
  const variantRefs = useRef({});
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [zodIssues, setZodIssues] = useState([]);

  const [product, setProduct] = useState({
    _id: "",
    name: "",
    description: "",
    category: "",
    collectionIds: [],
    info: {},
    variants: [],
    status: "draft",
  });
  const [isHydrated, setIsHydrated] = useState(null);

  const [refsReady, setRefsReady] = useState(false);

  const searchParams = useSearchParams();
  const variantId = searchParams.get("variant");

  // --- State for category autocomplete ---
  const [categoryQuery, setCategoryQuery] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const filteredCategories = categories.filter((cat) =>
    cat?.name.toLowerCase().includes(categoryQuery.toLowerCase()),
  );

  // --- State for collection dropdown ---
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  const descriptionTextareaRef = useRef(null);

  useEffect(() => {
    if (!initialProduct?._id) return;
    setIsProductLoading(true);
    const key = `product_draft_${initialProduct._id}`;
    const saved = localStorage.getItem(key);

    let finalProduct = initialProduct;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const isValid = BaseProductSchema.partial().safeParse(
          parsed.data,
        ).success;

        if (
          isValid &&
          parsed.updatedAt > new Date(initialProduct.updatedAt).getTime()
        ) {
          finalProduct = parsed.data;
        } else {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }

    setProduct(finalProduct);
    setCategoryQuery(
      capitalizeEachFirstCharOfWord(finalProduct.category || ""),
    );
    setIsHydrated(true);
    setIsProductLoading(false);
  }, [initialProduct?._id, initialProduct?.updatedAt]);

  useEffect(() => {
    if (!isHydrated || !product?._id) return;

    const key = `product_draft_${product._id}`;

    const timeout = setTimeout(() => {
      localStorage.setItem(
        key,
        JSON.stringify({
          data: product,
          updatedAt: Date.now(),
        }),
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [product, isHydrated]);

  useEffect(() => {
    const result = StrictProductSchema.safeParse(product);

    if (!result.success) {
      const issues = result.error.issues;
      console.log(issues);
      setZodIssues(issues);
    } else {
      setZodIssues([]);
    }
  }, [product]);

  // optional: initialize height if textarea has default value
  useEffect(() => {
    handleTextareInput(descriptionTextareaRef);
  }, []);

  // --- Click outside to close dropdowns ---
  useEffect(() => {
    const handleClick = () => {
      setShowCategoryDropdown(false);
      setShowCollectionDropdown(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // --- Collection logic ---
  const availableCollections = allCollections.filter(
    (col) => !product.collectionIds.includes(col),
  );

  const addCollection = (col) => {
    setProduct((prev) => ({
      ...prev,
      collectionIds: [...prev.collectionIds, col?.id],
    }));
    setShowCollectionDropdown(false);
  };

  const removeCollection = (col) => {
    setProduct((prev) => ({
      ...prev,
      collectionIds: prev.collectionIds.filter((c) => c !== col),
    }));
  };

  const updateField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const updateInfo = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      info: { ...prev.info, [field]: value },
    }));
  };

  const fieldData = (key) => {
    switch (key) {
      case "material":
        return {
          name: "Material",
          placeHolder: "e.g. plastic / Iron / Aluminium",
        };

      case "weight":
        return {
          name: "Weight",
          placeHolder: "e.g. 1500g, 1.5kg, 2000 g, or 2 kg",
          regex: /^(?:\d+(\.\d+)?\s?kg|\d+\s?g)$/i,
          error: "Enter valid weight (e.g. 1500g, 1.5kg, 2000 g, or 2 kg)",
        };

      case "country_of_origin":
        return {
          name: "Country of origin",
          placeHolder: "",
        };

      case "dimensions":
        return {
          name: "Dimensions (LxWxH)",
          placeHolder: "e.g. 10x5x7",
          regex: /^\d+x\d+x\d+$/i,
          error: "Format (LxWxH): 10x5x7",
        };

      case "type":
        return {
          name: "Type",
          placeHolder: "",
        };
    }
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: crypto.randomUUID(),
          options: [],
          price: 0,
          discount: 0,
          stock: 0,
          default: false,
          images: [],
        },
      ],
    }));
  };

  const updateVariant = (index, field, value) => {
    const variants = [...product.variants];
    variants[index][field] = value;

    setProduct((prev) => ({ ...prev, variants }));
  };

  const deleteVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const addOption = (variantIndex) => {
    const variants = [...product.variants];

    variants[variantIndex].options.push({
      id: crypto.randomUUID(),
      name: "",
      value: "",
    });

    setProduct((prev) => ({ ...prev, variants }));
  };

  const updateOption = (variantIndex, optionIndex, field, value) => {
    const variants = [...product.variants];

    variants[variantIndex].options[optionIndex][field] = value;

    setProduct((prev) => ({ ...prev, variants }));
  };

  const deleteOption = (variantIndex, optionIndex) => {
    const variants = [...product.variants];

    variants[variantIndex].options = variants[variantIndex].options.filter(
      (_, i) => i !== optionIndex,
    );

    setProduct((prev) => ({ ...prev, variants }));
  };

  const addImage = (variantIndex) => {
    const variants = [...product.variants];

    variants[variantIndex].images.push({
      id: crypto.randomUUID(),
      src: "",
      alt: "",
    });

    setProduct((prev) => ({ ...prev, variants }));
  };

  const updateImage = (variantIndex, imageIndex, field, value) => {
    const variants = [...product.variants];

    variants[variantIndex].images[imageIndex][field] = value;

    setProduct((prev) => ({ ...prev, variants }));
  };

  const deleteImage = (variantIndex, imageIndex) => {
    const variants = [...product.variants];

    variants[variantIndex].images = variants[variantIndex].images.filter(
      (_, i) => i !== imageIndex,
    );

    setProduct((prev) => ({ ...prev, variants }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PUT",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (data.success) {
        const key = `product_draft_${product._id}`;
        localStorage.removeItem(key); // ✅ ONLY NOW
        router.push(
          `/${session.user.role === "ADMIN" ? "admin" : "seller"}/products`,
        );
      }
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: err.message,
          type: "error",
        });
      }, 0);
    }
  };

  useEffect(() => {
    if (product?.variants?.length) {
      setRefsReady(true);
    }
  }, [product]);

  useEffect(() => {
    // if (!variantId) return;
    if (!variantId || !refsReady) return;

    const el = variantRefs.current[variantId];

    if (el) {
      const yOffset = -200; // 👈 distance from top
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, [variantId, refsReady, product]);

  const isSamePath = (a, b) => {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
  };

  const getFieldError = (path) => {
    const issue = zodIssues.find((i) => isSamePath(i.path, path));
    return issue?.message || "";
  };

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-60px-80px-24px-192px)] md:min-h-[calc(100vh-60px-130px)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      {/* Basic Info */}

      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Basic Info</h2>
        <FloatingInput
          id="product_name"
          label="Product Name"
          inputClassName=""
          error={getFieldError(["name"])}
          type="text"
          value={product.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <FloatingTextArea
          ref={descriptionTextareaRef}
          id="description"
          label="Description"
          inputClassName=""
          error={getFieldError(["description"])}
          value={product.description}
          rows={1}
          onChange={(e) => {
            updateField("description", e.target.value);
            handleTextareInput(descriptionTextareaRef);
          }}
        />

        <div className="flex gap-5">
          <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
            <FloatingInput
              id="category"
              label="Category"
              inputClassName=""
              error={getFieldError(["category"])}
              type="text"
              value={categoryQuery}
              onFocus={() => setShowCategoryDropdown(true)}
              onChange={(e) => {
                setCategoryQuery(capitalizeEachFirstCharOfWord(e.target.value));
                updateField(
                  "category",
                  capitalizeEachFirstCharOfWord(e.target.value),
                );
              }}
            />

            {showCategoryDropdown && (
              <div
                className="
                absolute
                top-full
                left-0
                w-full
                mt-1
                max-h-40
                overflow-y-auto
                bg-background_1
                border
                border-myBorderColor
                rounded-md
                shadow-md
                z-50
                custom-scrollbar
                "
              >
                {(categoryQuery ? filteredCategories : categories).map(
                  (cat) => (
                    <div
                      key={cat?.name.toLowerCase()}
                      onClick={() => {
                        updateField(
                          "category",
                          capitalizeEachFirstCharOfWord(cat?.name),
                        );
                        setCategoryQuery(
                          capitalizeEachFirstCharOfWord(cat?.name),
                        );
                        setShowCategoryDropdown(false);
                      }}
                      className="
                      px-3
                      py-2
                      text-sm
                      cursor-pointer
                      hover:bg-buttonHovered
                      "
                    >
                      {capitalizeEachFirstCharOfWord(cat?.name)}
                    </div>
                  ),
                )}

                {categoryQuery && filteredCategories.length === 0 && (
                  <div className="px-3 py-2 text-sm text-myTextColorMain">
                    Create new category "{categoryQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Collection IDs Section */}
      <div className="w-full relative">
        <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Collection IDs</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCollectionDropdown(!showCollectionDropdown);
              }}
              className="cursor-pointer button2 px-3 py-1"
            >
              + Add Collection
            </button>
          </div>
          {/* Selected Collections */}
          {product.collectionIds.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full">
              {product.collectionIds.map((col) => (
                <div
                  key={col}
                  className="flex items-center gap-1 bg-background_3 pl-3 pr-1.5 py-1 rounded-full border border-myBorderColor"
                >
                  <span>{convertDashStringToTextString(col)}</span>
                  <button
                    onClick={() => removeCollection(col)}
                    className="button2 rounded-full! cursor-pointer flex items-center justify-center w-6 h-6 "
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Collection Dropdown */}
          {showCollectionDropdown && (
            <div className="absolute top-full left-0 w-full mt-1 max-h-40 overflow-y-auto bg-background_1 border border-myBorderColor rounded-md shadow-md z-50 custom-scrollbar">
              {availableCollections.length > 0 ? (
                availableCollections.map((col) => (
                  <div
                    key={col?._id}
                    onClick={() => addCollection(col)}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-buttonHovered"
                  >
                    {col?.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-myTextColorMain">
                  All collections added
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}

      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Product Info</h2>

        {Object.keys(product.info).map((key) => {
          const field = fieldData(key);

          return (
            <FloatingInput
              key={key}
              id={key}
              label={field.name}
              inputClassName=""
              type="text"
              placeholder={field.placeHolder}
              value={product.info[key]}
              error={getFieldError(["info", key])}
              onChange={(e) => {
                const value = e.target.value;
                updateInfo(key, value);
              }}
            />
          );
        })}
      </div>

      {/* Variants */}

      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 flex flex-col gap-10">
        <div className="flex items-center justify-between ">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Variants</h2>

            {getFieldError(["variants"]) && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError(["variants"])}
              </p>
            )}
          </div>

          <button
            onClick={addVariant}
            className="cursor-pointer button2 px-3 py-1"
          >
            + Add Variant
          </button>
        </div>
        {product.variants.length > 0 && (
          <div className="flex flex-col gap-10">
            {product.variants.map((variant, i) => {
              const anyDefaultSelected = product.variants.some(
                (v) => v.default,
              );
              return (
                <div
                  key={variant.id}
                  ref={(el) => {
                    if (el) variantRefs.current[variant.id] = el;
                  }}
                  className={`relative border rounded-lg p-4 flex flex-col gap-4 ${
                    variant.stock < 10
                      ? "border-red-500 bg-red-500/5"
                      : "bg-background_3 border-myBorderColor"
                  }`}
                >
                  <div className="z-48 absolute -top-3 -right-3">
                    <button
                      onClick={() => deleteVariant(i)}
                      className="
                    w-6
                    h-6
                    button2
                    rounded-full!
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    "
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <FloatingInput
                      id="price"
                      label="Price"
                      inputClassName="pr-0!"
                      error={getFieldError(["variants", i, "price"])}
                      type="number"
                      keepPlaceHolderAbove={true}
                      value={variant.price}
                      placeholder={""}
                      onChange={(e) =>
                        updateVariant(i, "price", Number(e.target.value))
                      }
                    />

                    <FloatingInput
                      id="discount"
                      label="Discount"
                      inputClassName="pr-0!"
                      error={getFieldError(["variants", i, "discount"])}
                      type="number"
                      keepPlaceHolderAbove={true}
                      value={variant.discount}
                      onChange={(e) =>
                        updateVariant(i, "discount", Number(e.target.value))
                      }
                    />

                    <FloatingInput
                      id="stock"
                      label="Stock"
                      inputClassName="pr-0!"
                      error={getFieldError(["variants", i, "stock"])}
                      type="number"
                      keepPlaceHolderAbove={true}
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(i, "stock", Number(e.target.value))
                      }
                    />
                  </div>

                  {/* Options */}

                  <div className="bg-background_2 border border-myBorderColor rounded-lg p-4 flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm">Options</p>

                        {getFieldError(["variants", i, "options"]) && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError(["variants", i, "options"])}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => addOption(i)}
                        className="cursor-pointer text-sm button2 px-2 py-1"
                      >
                        + Add Option
                      </button>
                    </div>
                    {variant.options.length > 0 && (
                      <div className="flex flex-col gap-10">
                        {variant.options.map((option, optionIndex) => (
                          <div
                            key={option.id}
                            className="relative bg-background_3 border border-myBorderColor rounded-lg p-4 flex flex-col gap-4"
                          >
                            <div className="absolute -top-3 -right-3">
                              <button
                                onClick={() => deleteOption(i, optionIndex)}
                                className="
                              w-6
                              h-6
                              button2
                              rounded-full!
                              cursor-pointer
                              flex
                              items-center
                              justify-center
                              "
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <div className="flex gap-3">
                              <FloatingInput
                                id={`option_name_${option.id}`}
                                label="Option Name"
                                className="w-1/2!"
                                inputClassName=""
                                error={getFieldError([
                                  "variants",
                                  i,
                                  "options",
                                  optionIndex,
                                  "name",
                                ])}
                                type="text"
                                value={option.name}
                                onChange={(e) =>
                                  updateOption(
                                    i,
                                    optionIndex,
                                    "name",
                                    e.target.value,
                                  )
                                }
                              />

                              <FloatingInput
                                id={`option_value_${option.id}`}
                                label="Option Value"
                                className="w-1/2!"
                                inputClassName=""
                                error={getFieldError([
                                  "variants",
                                  i,
                                  "options",
                                  optionIndex,
                                  "value",
                                ])}
                                type="text"
                                value={option.value}
                                onChange={(e) =>
                                  updateOption(
                                    i,
                                    optionIndex,
                                    "value",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Images */}

                  <div className="bg-background_2 border border-myBorderColor rounded-lg p-4 flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm">Images</p>

                        {getFieldError(["variants", i, "images"]) && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError(["variants", i, "images"])}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => addImage(i)}
                        className="cursor-pointer text-sm button2 px-2 py-1"
                      >
                        + Add Image
                      </button>
                    </div>

                    {variant.images.length > 0 && (
                      <div className="flex flex-col gap-10">
                        {variant.images.map((img, imgIndex) => (
                          <div
                            key={img.id}
                            className="relative bg-background_3 border border-myBorderColor rounded-lg p-4 flex flex-col gap-4"
                          >
                            <div className="absolute -top-3 -right-3">
                              <button
                                onClick={() => deleteImage(i, imgIndex)}
                                className="
                              w-6
                              h-6
                              button2
                              rounded-full!
                              cursor-pointer
                              flex
                              items-center
                              justify-center
                              "
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <FloatingInput
                              id={`image_src_${img.id}`}
                              label="Image URL"
                              inputClassName=""
                              error={getFieldError([
                                "variants",
                                i,
                                "images",
                                imgIndex,
                                "src",
                              ])}
                              type="text"
                              value={img.src}
                              onChange={(e) =>
                                updateImage(i, imgIndex, "src", e.target.value)
                              }
                            />

                            <FloatingInput
                              id={`image_alt_${img.id}`}
                              label="Alt Text"
                              inputClassName=""
                              error={getFieldError([
                                "variants",
                                i,
                                "images",
                                imgIndex,
                                "alt",
                              ])}
                              type="text"
                              value={img.alt}
                              onChange={(e) =>
                                updateImage(i, imgIndex, "alt", e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Default Variant checkbox */}
                  {(!anyDefaultSelected || variant.default) && (
                    <label className="flex gap-2 text-sm items-center">
                      <input
                        type="checkbox"
                        checked={variant.default}
                        onChange={(e) =>
                          updateVariant(i, "default", e.target.checked)
                        }
                      />
                      Default Variant
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {/* Update or Save button */}
        <button
          onClick={handleSubmit}
          className="button1 px-6 py-2 cursor-pointer"
        >
          Update Product
        </button>

        {/* Activate button */}
        {product.status === "draft" &&
          zodIssues.length === 0 &&
          product.variants.some((v) => v.stock > 0) && (
            // if issues exist then don't show the activate button
            <button
              onClick={() => {
                updateField("status", "active");
                handleSubmit();
              }}
              className="button1 px-6 py-2 cursor-pointer"
            >
              Activate
            </button>
          )}

        {/* Archive button */}
        {product.status === "active" &&
          !product.variants.some((v) => v.stock > 0) && (
            <button
              onClick={() => {
                updateField("status", "archive");
                handleSubmit();
              }}
              className="button1 px-6 py-2 cursor-pointer"
            >
              Archive
            </button>
          )}
      </div>
    </div>
  );
}
