"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";
import { X } from "lucide-react";
import FloatingTextArea from "@/components/FloatingTextArea";
import {
  capitalizeEachFirstCharOfWord,
  convertDashStringToTextString,
  getAdminProductIssues,
  handleTextareInput,
} from "@/utils/utilities";

export default function EditProductForm({
  session,
  product: initialProduct,
  categories = [],
  allCollections = [],
}) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState(initialProduct);

  // --- State for category autocomplete ---
  const [categoryQuery, setCategoryQuery] = useState(
    capitalizeEachFirstCharOfWord(initialProduct.category) || "",
  );
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const filteredCategories = categories.filter((cat) =>
    cat?.name.toLowerCase().includes(categoryQuery.toLowerCase()),
  );

  // --- State for collection dropdown ---
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  const descriptionTextareaRef = useRef(null);

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
          price: "",
          discount: "",
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
    const res = await fetch(`/api/admin/products/${product._id}`, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.success)
      router.push(
        `/${session.user.role === "ADMIN" ? "admin" : "seller"}/products`,
      );
  };

  useEffect(() => {
    console.log("product - >", product);
  }, [product]);
  return (
    <div className="space-y-6 mb-20">
      {/* Basic Info */}

      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Basic Info</h2>
        <FloatingInput
          id="product_name"
          label="Product Name"
          inputClassName="input!"
          type="text"
          value={product.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <FloatingTextArea
          ref={descriptionTextareaRef}
          id="description"
          label="Description"
          inputClassName="input!"
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
              inputClassName="input1!"
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
                  className="flex items-center gap-1 bg-background_3 pl-2 pr-1.5 py-1 rounded-full border border-myBorderColor"
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
              inputClassName="input1!"
              type="text"
              placeholder={field.placeHolder}
              value={product.info[key]}
              error={errors[key]} // ✅ dynamic error
              onChange={(e) => {
                const value = e.target.value;

                updateInfo(key, value);

                setErrors((prev) => ({
                  ...prev,
                  [key]: "",
                }));
              }}
              onBlur={(e) => {
                const value = e.target.value;

                if (field.regex && value && !field.regex.test(value)) {
                  setErrors((prev) => ({
                    ...prev,
                    [key]: field.error,
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    [key]: "",
                  }));
                }
              }}
            />
          );
        })}
      </div>

      {/* Variants */}

      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 flex flex-col gap-10">
        <div className="flex items-center justify-between ">
          <h2 className="text-lg font-medium">Variants</h2>

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
                  className="relative bg-background_3 border border-myBorderColor rounded-lg p-4 flex flex-col gap-4"
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
                      inputClassName="input1!"
                      type="text"
                      value={variant.price}
                      placeholder={""}
                      onChange={(e) =>
                        updateVariant(i, "price", e.target.value)
                      }
                    />

                    <FloatingInput
                      id="discount"
                      label="Discount"
                      inputClassName="input1!"
                      type="text"
                      value={variant.discount}
                      onChange={(e) =>
                        updateVariant(i, "discount", e.target.value)
                      }
                    />

                    <FloatingInput
                      id="stock"
                      label="Stock"
                      inputClassName="input1!"
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(i, "stock", e.target.value)
                      }
                    />
                  </div>

                  {/* Options */}

                  <div className="bg-background_2 border border-myBorderColor rounded-lg p-4 flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Options</p>

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
                                inputClassName="input1!"
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
                                inputClassName="input1!"
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
                      <p className="text-sm">Images</p>

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
                              inputClassName="input1!"
                              type="text"
                              value={img.src}
                              onChange={(e) =>
                                updateImage(i, imgIndex, "src", e.target.value)
                              }
                            />

                            <FloatingInput
                              id={`image_alt_${img.id}`}
                              label="Alt Text"
                              inputClassName="input1!"
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
      {/* Status Section
      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 flex justify-between items-center">
        <h2 className="text-lg font-medium">Status</h2>
        <div className="relative w-48 bg-background_3">
          <select
            value={product.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="
              input1!
              w-full
              cursor-pointer
              bg-background_3
              px-4
              py-2
            "
          >
            <option value="draft">Draft</option>
            {product.status === "draft" && (
              <option value="active">Active</option>
            )}
            {product.status === "active" && (
              <option value="archive">Archive</option>
            )}
          </select>
        </div>
      </div> */}

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
          getAdminProductIssues(product).length === 0 && ( // if issues exist then don't show the activate button
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
        {product.status === "active" && (
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
