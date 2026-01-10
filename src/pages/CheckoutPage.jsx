import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import "./checkout-header.css";
import "./CheckoutPage.css";
import { formatMoney } from "../utils/money";

export function CheckoutPage({ cart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    axios
      .get("/api/delivery-options?expand=estimatedDeliveryTime")
      .then((response) => setDeliveryOptions(response.data))
      .catch((err) => console.error("Delivery options fetch error:", err));
  }, []);

  useEffect(() => {
    axios
      .get("/api/payment-summary")
      .then((response) => {
        const data = response.data || {};

        const formattedSummary = {
          ...data,
          priceCostKshs: (data.priceCostCents || 0) / 100,
          shippingCostKshs: (data.shippingCostCents || 0) / 100,
          totalCostBeforeKshs: (data.totalCostBeforeCents || 0) / 100,
          taxKshs: (data.taxCents || 0) / 100,
          totalCostKshs: (data.totalCostCents || 0) / 100,
        };

        setPaymentSummary(formattedSummary);
      })
      .catch((err) => console.error("Payment summary fetch error:", err));
  }, []);

  
  const safeCart = Array.isArray(cart) ? cart : [];

  return (
    <>
      <title>Checkout</title>

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/" className="logo-link">
              <img className="logo" src="/src/assets/shopping-bag.png" />
              <h1 className="logo-header">KAPU</h1>
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              {safeCart.length} items
            </a>
            )
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
         
          <div className="order-summary">
            {safeCart.length > 0 && deliveryOptions.length > 0 ? (
              safeCart.map((cartItem) => {
                const price =
                  cartItem.product?.priceKshs || cartItem.product?.priceCents || 0;

                const selectedDeliveryOption = deliveryOptions.find(
                  (option) => option.id === cartItem.deliveryOptionId
                );

                return (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date:{" "}
                      {selectedDeliveryOption?.estimatedDeliveryTimeMs
                        ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format(
                            "dddd, MMMM D"
                          )
                        : "No delivery date"}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product?.image || ""}
                        alt={cartItem.product?.name || "Product"}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">{cartItem.product?.name || "Unnamed product"}</div>
                        <div className="product-price">Ksh {formatMoney(price)}</div>
                        <div className="product-quantity">
                          <span>
                            Quantity:{" "}
                            <span className="quantity-label">{cartItem.quantity || 0}</span>
                          </span>
                          <span className="update-quantity-link link-primary">Update</span>
                          <span className="delete-quantity-link link-primary">Delete</span>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">Choose a delivery option:</div>

                        {deliveryOptions.map((deliveryOption) => {
                          const priceString =
                            deliveryOption.priceKshs > 0
                              ? `${formatMoney(deliveryOption.priceKshs)} - Shipping`
                              : "Free Shipping";

                          return (
                            <div key={deliveryOption.id} className="delivery-option">
                              <input
                                type="radio"
                                checked={deliveryOption.id === cartItem.deliveryOptionId}
                                className="delivery-option-input"
                                name={`delivery-option-${cartItem.productId}`}
                                readOnly
                              />
                              <div>
                                <div className="delivery-option-date">
                                  {deliveryOption.estimatedDeliveryTimeMs
                                    ? dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                                        "dddd, MMMM D"
                                      )
                                    : "No date"}
                                </div>
                                <div className="delivery-option-price">{priceString}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No items in cart or delivery options unavailable.</div>
            )}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>

            {paymentSummary ? (
              <>
                <div className="payment-summary-row">
                  <div>Items ({paymentSummary.totalItems || 0}):</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.priceCostKshs)}</div>
                </div>

                <div className="payment-summary-row">
                  <div>Shipping &amp; handling:</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.shippingCostKshs)}</div>
                </div>

                <div className="payment-summary-row subtotal-row">
                  <div>Total before tax:</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostBeforeKshs)}</div>
                </div>

                <div className="payment-summary-row">
                  <div>Estimated tax (10%):</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.taxKshs)}</div>
                </div>

                <div className="payment-summary-row total-row">
                  <div>Order total:</div>
                  <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostKshs)}</div>
                </div>

                <button className="place-order-button button-primary">
                  Place your order
                </button>
              </>
            ) : (
              <div>Loading payment summary...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
