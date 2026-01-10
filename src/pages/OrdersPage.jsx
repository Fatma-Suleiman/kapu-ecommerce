import axios from "axios";
import dayjs from "dayjs";
import { formatMoney } from "../utils/money";
import { useState, useEffect, Fragment } from "react";
import { Header } from "../components/Header";
import "./OrdersPage.css";

export function OrdersPage({ cart }) {
  const [orders, setOrders] = useState([]); // ✅ FIX

  useEffect(() => {
    axios
      .get("/api/orders?expand=products")
      .then((response) => {
        setOrders(response.data || []);
      })
      .catch((err) => {
        console.error("Orders fetch error:", err);
        setOrders([]);
      });
  }, []);

  return (
    <>
      <title>Orders</title>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-container">
              <div className="order-header">
                <div className="order-header-left-section">
                  <div className="order-date">
                    <div className="order-header-label">Order Placed:</div>
                    <div>
                      {order.orderTimeMs
                        ? dayjs(order.orderTimeMs).format("MMMM D")
                        : "Unknown date"}
                    </div>
                  </div>

                  <div className="order-total">
                    <div className="order-header-label">Total:</div>
                    <div>
                      Ksh {formatMoney((order.totalCostCents || 0) / 100)}
                    </div>
                  </div>
                </div>

                <div className="order-header-right-section">
                  <div className="order-header-label">Order ID:</div>
                  <div>{order.id}</div>
                </div>
              </div>

              <div className="order-details-grid">
                {order.products?.map((orderProduct) => (
                  <Fragment key={orderProduct.product.id}>
                    <div className="product-image-container">
                      <img
                        src={orderProduct.product.image}
                        alt={orderProduct.product.name}
                      />
                    </div>

                    <div className="product-details">
                      <div className="product-name">
                        {orderProduct.product.name}
                      </div>

                      <div className="product-delivery-date">
                        Arriving on:{" "}
                        {dayjs(orderProduct.estimatedDeliveryTimeMs).format(
                          "MMMM D"
                        )}
                      </div>

                      <div className="product-quantity">
                        Quantity: {orderProduct.quantity}
                      </div>

                      <button className="buy-again-button button-primary">
                        <span className="buy-again-message">Add to Cart</span>
                      </button>
                    </div>

                    <div className="product-actions">
                      <a href="/tracking">
                        <button className="track-package-button button-secondary">
                          Track package
                        </button>
                      </a>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
