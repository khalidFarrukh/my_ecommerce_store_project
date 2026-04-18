"use client";
import FloatingInput from "@/components/FloatingInput";
import FloatingTextArea from "@/components/FloatingTextArea";
import { getVariantPricing } from "@/utils/productVariant";
import { getShippingPrice } from "@/utils/shipping";
import { handleTextareInput, parseDimensions, parseWeight } from "@/utils/utilities";
import { Delete, Edit, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function CheckoutClient({ user, addresses: initialAddresses }) {
  const cartItems = useSelector(state => state.cart.cartState.items);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  useEffect(() => {
    if (!cartItems.length) return;

    const fetchProducts = async () => {
      const activeProductIds = cartItems
        .filter(i => i.variants.some(v => v.active))
        .map(i => i.product_id);

      if (!activeProductIds.length) return;

      const res = await fetch("/api/products/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: activeProductIds
        })
      });

      const data = await res.json();
      setCheckoutProducts(data);
    };

    fetchProducts();
  }, [cartItems]);

  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (!checkoutProducts.length) {
      // setActiveVariantsSize(0);
      setSubTotal(0);
      setShippingFee(0);
      return;
    };

    // let count = 0;
    let subTotalCount = 0;
    let totalChargeableWeight = 0;

    cartItems.forEach((product, pIndex) => {
      product.variants.forEach((variant, vIndex) => {
        if (variant.active) {
          const checkoutProductByFetch = checkoutProducts.find(
            p => p._id === product.product_id
          );

          const checkoutVariantByFetch = checkoutProductByFetch.variants.find(
            v => v.id === variant.variant_id
          );
          const { wasting, price, discount, finalPrice } = getVariantPricing(checkoutVariantByFetch);

          subTotalCount += finalPrice * variant.quantity;
          // count++;

          const weight = parseWeight(checkoutProductByFetch.info.weight);
          const [l, w, h] = parseDimensions(checkoutProductByFetch.info.dimensions);
          let volumetricWeight = 0;
          if (l && w && h) {
            volumetricWeight = (l * w * h) / 5000;
          }
          const chargeableWeight = Math.max(weight, volumetricWeight);
          totalChargeableWeight += chargeableWeight * variant.quantity;
        }
      });
    });

    const shippingFee = getShippingPrice(totalChargeableWeight);
    // setActiveVariantsSize(count);
    setSubTotal(subTotalCount);
    setShippingFee(shippingFee);
  }, [cartItems, checkoutProducts])

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState(initialAddresses.find(a => a.default) || null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    country: "",
    addressLine: ""
  });

  const [editingAddressId, setEditingAddressId] = useState(null);

  const addressLineTextareaRef = useRef(null);

  // optional: initialize height if textarea has default value
  useEffect(() => {
    handleTextareInput(addressLineTextareaRef);
  }, []);

  const handleAddAddress = async () => {
    const method = editingAddressId ? "PUT" : "POST";

    const res = await fetch("/api/addresses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingAddressId
          ? { ...form, _id: editingAddressId }
          : form
      ),
    });

    if (res.status === 401) {
      alert("Session expired");
      return;
    }

    const data = await res.json();

    if (editingAddressId) {
      // UPDATE UI
      setAddresses(prev =>
        prev.map(a => (a._id === editingAddressId ? data : a))
      );
    } else {
      // ADD NEW
      setAddresses(prev => [...prev, data]);
      if (data.default)
        setSelectedAddress(data);
    }

    // reset
    setShowForm(false);
    setEditingAddressId(null);
    setForm({ name: "", phone: "", city: "", addressLine: "" });
  };

  console.log("editingAddressId: ", editingAddressId);
  useEffect(() => {
    console.log("editingAddressId: ", editingAddressId);
  }, [editingAddressId])

  const handleEditClick = (addr) => {
    setForm({
      name: addr.name || "",
      phone: addr.phone || "",
      city: addr.city || "",
      addressLine: addr.addressLine || "",
    });

    setEditingAddressId(addr._id);
    setShowForm(true);
  };

  const handleDeleteAddress = async (addr) => {
    const res = await fetch(`/api/addresses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: addr._id }),
    });

    if (res.status === 401) {
      alert("Session expired");
      return;
    }

    const data = await res.json();

    // ✅ replace entire state (no guessing)
    setAddresses(data);

    // ✅ update selected address safely
    const newDefault = data.find(a => a.default);
    setSelectedAddress(newDefault || null);
  };


  const handleSelectAddress = async (addr) => {
    // optional optimistic UI (good UX)
    // setSelectedAddress(addr);

    const res = await fetch("/api/addresses/set-default", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: addr._id }),
    });

    if (res.status === 401) {
      alert("Session expired");
      return;
    }

    const data = await res.json();

    // ✅ replace full state
    setAddresses(data);

    // ✅ ensure selected matches backend truth
    const newDefault = data.find(a => a.default);
    setSelectedAddress(newDefault || null);
  };

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {

    if (!selectedAddress) return;
    if (!paymentMethod) return;
    if (user?.role === "ADMIN") return;

    try {
      setPlacingOrder(true);

      const orderItems = [];

      cartItems.forEach((product) => {
        const checkoutProduct = checkoutProducts.find(
          (p) => p._id === product.product_id
        );

        if (!checkoutProduct) return;

        product.variants.forEach((variant) => {
          if (!variant.active) return;

          const checkoutVariant = checkoutProduct.variants.find(
            (v) => v.id === variant.variant_id
          );

          if (!checkoutVariant) return;

          const { price, discount, finalPrice } =
            getVariantPricing(checkoutVariant);

          orderItems.push({
            productId: product.product_id,
            productName: checkoutProduct.name,

            variantId: variant.variant_id,
            options: checkoutVariant.options,

            image: checkoutVariant.images?.[0]?.src || "",

            price,
            discount,
            finalPrice,

            quantity: variant.quantity,
            total: finalPrice * variant.quantity,
          });
        });
      });

      if (!orderItems.length) {
        alert("No valid items in cart");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          pricing: {
            subtotal: subTotal,
            shippingFee,
            total: subTotal + shippingFee,
          },
          shippingAddress: selectedAddress,
          payment: {
            method: paymentMethod
          }
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to place order");
      }

      // ✅ success
      alert("Order placed successfully!");

      // OPTIONAL:
      // clear cart
      // router.push("/orders");
      // or show confirmation page

    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };


  if (checkoutProducts.length === 0) {
    return <div className="absolute w-screen h-screen left-0 top-0 flex items-center justify-center">Loading</div>
  }

  return (
    <div className="w-full space-y-8">
      <h1 className="text-[30px] mt-3 font-bold">Checkout</h1>

      {/* {addresses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm mb-2">Default Address</h3>

          {addresses
            .filter(addr => addr.default)
            .map(addr => (
              <div
                key={addr._id}
                className="border border-myBorderColor p-3 rounded-md bg-background_2"
              >
                <p className="font-semibold">{addr.name}</p>
                <p>{addr.phone}</p>
                <p>{addr.city}</p>
                <p>{addr.addressLine}</p>
              </div>
            ))}
        </div>
      )} */}
      {/* ADDRESS SECTION */}
      <div>
        <div className="w-full h-12.5 flex items-center justify-between mb-8">
          <h2 className="text-base md:text-xl font-semibold md:font-bold">Delivery Address</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="p-1.5 md:p-3 text-sm md:text-base border button1 cursor-pointer rounded-md"
            >
              + Add Address
            </button>
          )}
        </div>

        {
          addresses.length === 0 && !showForm ? (
            <div className="text-center py-10">No addresses found. Please add an address.</div>
          ) :
            <div className="flex flex-col gap-10">
              {
                addresses.map(addr => (
                  <div
                    key={addr._id}
                    className="relative"

                  >

                    <div className="absolute -top-3 right-3 flex items-center gap-4">
                      {addr.default && (
                        <span className="text-xs bg-green-700 px-2 py-1 text-white rounded-md border border-myBorderColor font-semibold">Default</span>
                      )}
                      {
                        !showForm &&
                        <>
                          <button
                            onClick={() => handleEditClick(addr)}
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
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr)}
                            className="
                        w-6
                        h-6
                        text-white!
                        bg-[darkred]!
                        hover:bg-red-600!
                        active:bg-white!
                        active:text-[darkred]!
                        rounded-full!
                        cursor-pointer
                        flex
                        items-center
                        justify-center
                        "
                          >
                            <Trash size={14} />
                          </button>
                        </>
                      }
                    </div>
                    <div
                      onClick={() => !showForm && handleSelectAddress(addr)}
                      className={`${!showForm && "cursor-pointer"} border text-sm md:text-base p-3 ${addr.default ? "border-green-700" : "border-myBorderColor"} rounded-md bg-background_2`}
                    >
                      {
                        addr.name &&
                        <p className="font-semibold">Name: {addr.name}</p>
                      }

                      {
                        addr.phone &&
                        <p>Phone: {addr.phone}</p>
                      }
                      {
                        addr.city &&
                        <p>City: {addr.city}</p>
                      }
                      {
                        addr.country &&
                        <p>Country: {addr.country}</p>
                      }
                      {
                        addr.addressLine &&
                        <p>Address: {addr.addressLine}</p>
                      }
                      {
                        addr?.location &&
                        <p> Location (lat, lng): {addr.location?.lat}, {addr.location?.lng}</p>
                      }
                    </div>
                  </div>
                ))
              }
            </div>
        }

        {showForm && (
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddAddress();
            }}
          >
            <FloatingInput
              id="address_name"
              label="Full Name"
              inputClassName="input!"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <FloatingInput
              id="address_phone"
              label="Phone Number"
              inputClassName="input!"
              type="tel"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value;

                // allow digits, +, space, dash
                if (/^[0-9+\-\s]*$/.test(value)) {
                  setForm({ ...form, phone: value });
                }
              }}
              required
            />

            <FloatingInput
              id="address_city"
              label="City"
              inputClassName="input!"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
              required
            />

            <FloatingTextArea
              ref={addressLineTextareaRef}
              id="address_line"
              label="Full Address"
              inputClassName="input!"
              value={form.addressLine}
              rows={1}
              onChange={(e) => {
                setForm({ ...form, addressLine: e.target.value });
                handleTextareInput(addressLineTextareaRef);
              }}
              required
            />

            <button
              type="submit"
              className="w-full cursor-pointer border px-4 py-3 border-myBorderColor rounded-md button1"
            >
              Save Address
            </button>
          </form>
        )}
      </div>

      {/* PAYMENT METHOD */}
      <div>
        <h2 className="text-base md:text-xl font-semibold md:font-bold mb-3">
          Payment Method
        </h2>

        <div className="flex flex-col gap-3">

          {/* COD */}
          <label
            className={`
        flex items-center justify-between p-3 rounded-md border cursor-pointer
        ${paymentMethod === "cod" ? "border-green-600" : "border-myBorderColor"}
        bg-background_2
      `}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>Cash on Delivery (COD)</span>
            </div>
          </label>

          {/* JazzCash */}
          <label
            className={`
        flex items-center justify-between p-3 rounded-md border cursor-pointer
        ${paymentMethod === "jazzcash" ? "border-green-600" : "border-myBorderColor"}
        bg-background_2
      `}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "jazzcash"}
                onChange={() => setPaymentMethod("jazzcash")}
              />
              <span>JazzCash</span>
            </div>
          </label>

        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="w-full">
        <h2 className="text-base md:text-xl font-semibold md:font-bold mb-3 space-y-3">Order Summary</h2>
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="flex-1 space-y-3 text-sm md:text-base">
            {cartItems.map((cartProduct, cartProductIndex) => {
              const checkoutProduct = checkoutProducts.find(p => p._id === cartProduct.product_id);

              if (!checkoutProduct) return null;
              return (
                <div key={cartProduct.product_id} className="w-full space-y-2 ">
                  <div className="rounded-[12px] bg-background_2 border border-myBorderColor py-4 px-5 flex flex-col gap-2">
                    <h3>{checkoutProduct.name}</h3>
                    {
                      cartProduct.variants.filter(v => v.active).map((cartVariant, cartVariantIndex) => {
                        const checkoutVariant = checkoutProduct.variants.find(v => v.id === cartVariant.variant_id);
                        if (!checkoutVariant) return null;
                        const { wasting, price, discount, finalPrice } = getVariantPricing(checkoutVariant);
                        return (
                          <React.Fragment key={cartVariant.variant_id}>
                            <div className="w-full flex-col md:flex-row flex md:items-center gap-x-3 gap-y-3">
                              <div className="w-full md:w-max flex gap-3 justify-between">
                                <div className="size-[60px] w375:size-[100px] overflow-hidden flex items-center justify-center">
                                  <Image
                                    src={checkoutVariant.images[0]["src"]}
                                    alt={checkoutVariant.images[0]["alt"]}
                                    className="min-w-0 min-h-0 h-auto w-[60px] w375:w-[100px]"
                                    width={500}
                                    height={500}
                                    priority
                                  />
                                </div>
                                <div className="flex flex-wrap flex-row items-center gap-3 justify-end md:hidden">
                                  <div>
                                    Quantity: {cartVariant.quantity}
                                  </div>
                                  <div className="text-right min-w-[120px]">
                                    {discount > 0 && (
                                      <div className="line-through text-xs md:text-sm text-gray-400">
                                        Rs. {price}
                                      </div>
                                    )}

                                    <div className="font-normal md:font-medium">
                                      Rs. {finalPrice} × {cartVariant.quantity}
                                    </div>

                                    <div className="font-semibold md:font-bold text-lg">
                                      Rs. {finalPrice * cartVariant.quantity}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 flex flex-wrap gap-x-4 gap-y-2">
                                {checkoutVariant.options.map((option) => (
                                  <div key={option.id} className="truncate">
                                    {option.name}: {option.value}
                                  </div>
                                ))}
                              </div>
                              <div className="hidden md:flex gap-4 items-center">
                                <div className="flex flex-wrap items-center gap-4 justify-center">

                                  <div>
                                    Quantity: {cartVariant.quantity}
                                  </div>
                                  <div className="text-right min-w-[120px]">
                                    {discount > 0 && (
                                      <div className="line-through text-sm text-gray-400">
                                        Rs. {price}
                                      </div>
                                    )}

                                    <div className="font-medium">
                                      Rs. {finalPrice} × {cartVariant.quantity}
                                    </div>

                                    <div className="font-bold text-lg">
                                      Rs. {finalPrice * cartVariant.quantity}
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                            {
                              cartVariantIndex < cartProduct.variants.length - 1 &&
                              <div className="border border-myBorderColor" />
                            }
                          </React.Fragment>
                        );
                      })
                    }
                  </div>
                </div>
              )
            })}
          </div>
          <div className="w-full md:max-w-[375px] h-fit rounded-[12px] bg-background_2 border border-myBorderColor py-4 px-5 flex flex-col gap-3 md:sticky md:top-[72px]">
            <div className="space-y-2 w-full text-sm md:text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>
                  Shipping Fee (est.)
                  <br />
                  (can change)
                </span>
                <span>Rs. {shippingFee}</span>
              </div>

              <div className="flex justify-between font-semibold md:font-bold text-base md:text-lg">
                <span>Total</span>
                <span>Rs. {subTotal + shippingFee}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || placingOrder || !paymentMethod}
                className="w-full p-2 border button2 cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>


    </div >
  );
}