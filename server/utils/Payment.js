const SSLCommerzPayment = require("sslcommerz-lts");

const SSLCommerz = new SSLCommerzPayment(
  process.env.SSLCOMMERZ_STORE_ID,
  process.env.SSLCOMMERZ_API_KEY,
  false
);

// This function initializes the payment request with SSLCommerz
module.exports.createPaymentRequest = async (
  total_amount,
  tran_id,
  product_name,
  product_category,
  num_of_item,
  emi_option,
  user,
  url,
  address,
  phoneNumber
) => {
  try {
    const apiResponse = await SSLCommerz.init({
      total_amount: total_amount.toFixed(2),
      currency: "BDT",
      tran_id,
      productcategory: product_category,
      success_url: `${process.env.BACKEND_URL}${url.success}`,
      fail_url: `${process.env.BACKEND_URL}${url.fail}`,
      cancel_url: `${process.env.FRONTEND_URL}${url.cancel}`,
      ipn_url: `${process.env.BACKEND_URL}${url.ipn}`,
      shipping_method: "No",
      product_name,
      product_category,
      num_of_item,
      product_profile: "general",
      emi_option,
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: address,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: phoneNumber,
      value_a: tran_id,
    });

    return apiResponse;
  } catch (error) {
    console.error("Payment request error:", error);
    throw new Error("Failed to create payment request");
  }
};

// This function validates the payment after the transaction
module.exports.validatePayment = async (val_id) => {
  try {
    const apiResponse = await SSLCommerz.validate({
      val_id,
    });

    return apiResponse;
  } catch (error) {
    console.error("Payment validation error:", error);
    throw new Error("Failed to validate payment");
  }
};
