module.exports.createDeliveryRequest = async (options) => {
  try {
    const response = await fetch(
      process.env.STEADFAST_API_URL + "/create_order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.STEADFAST_API_KEY,
          "Secret-Key": process.env.STEADFAST_SECRET_KEY,
        },
        body: JSON.stringify(options),
      }
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating delivery request:", error);
    throw new Error("Failed to create delivery request");
  }
};

module.exports.getDeliveryStatus = async (trackingCode) => {
  try {
    const response = await fetch(
      process.env.STEADFAST_API_URL + `/status_by_trackingcode/${trackingCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.STEADFAST_API_KEY,
          "Secret-Key": process.env.STEADFAST_SECRET_KEY,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching delivery status:", error);
    throw new Error("Failed to fetch delivery status");
  }
};
