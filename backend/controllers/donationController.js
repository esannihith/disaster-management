const paypalClient = require('../config/paypal');
const paypal = require('@paypal/checkout-server-sdk');
const Donation = require('../models/Donation');

// Create Order
exports.createOrder = async (req, res) => {
  const { name, email, amount, isRecurring, message } = req.body;

  try {
    // Create a new order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
        },
      ],
    });

    // Execute the PayPal order creation
    const order = await paypalClient.execute(request);

    // Save the donation with status PENDING
    const newDonation = await Donation.create({
      name,
      email,
      amount,
      isRecurring,
      message,
      paymentId: order.result.id,
      status: "PENDING",
    });

    // Return the PayPal order ID
    res.status(201).json({ id: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: "Error creating PayPal order" });
  }
};

// Capture Order
exports.captureOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Create a new capture request
    const request = new paypal.orders.OrdersCaptureRequest(id);
    request.requestBody({});

    // Execute the capture request
    const capture = await paypalClient.execute(request);

    // Update donation status to COMPLETED
    const donation = await Donation.findOneAndUpdate(
      { paymentId: id },
      { status: "COMPLETED" },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json({ message: "Payment captured successfully", donation });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    res.status(500).json({ error: "Error capturing payment" });
  }
};
