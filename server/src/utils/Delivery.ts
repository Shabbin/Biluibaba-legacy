interface DeliveryOptions {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
}

interface DeliveryResponse {
  status: number;
  message: string;
  consignment?: {
    consignment_id: string;
    tracking_code: string;
    status: string;
  };
}

interface DeliveryStatusResponse {
  status: number;
  delivery_status: string;
  current_status?: string;
  updated_at?: string;
}

/**
 * Creates a delivery request with Steadfast courier
 */
export const createDeliveryRequest = async (
  options: DeliveryOptions
): Promise<DeliveryResponse> => {
  try {
    const response = await fetch(
      process.env.STEADFAST_API_URL + '/create_order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.STEADFAST_API_KEY ?? '',
          'Secret-Key': process.env.STEADFAST_SECRET_KEY ?? '',
        },
        body: JSON.stringify(options),
      }
    );

    const data = (await response.json()) as DeliveryResponse;
    console.log('Delivery request created:', data);
    return data;
  } catch (error) {
    console.error('Error creating delivery request:', error);
    throw new Error('Failed to create delivery request');
  }
};

/**
 * Gets the delivery status by tracking code
 */
export const getDeliveryStatus = async (
  trackingCode: string
): Promise<DeliveryStatusResponse> => {
  try {
    const response = await fetch(
      `${process.env.STEADFAST_API_URL}/status_by_trackingcode/${trackingCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.STEADFAST_API_KEY ?? '',
          'Secret-Key': process.env.STEADFAST_SECRET_KEY ?? '',
        },
      }
    );

    const data = (await response.json()) as DeliveryStatusResponse;
    return data;
  } catch (error) {
    console.error('Error fetching delivery status:', error);
    throw new Error('Failed to fetch delivery status');
  }
};

/**
 * Cancels a delivery order
 */
export const cancelDelivery = async (
  consignmentId: string
): Promise<DeliveryResponse> => {
  try {
    const response = await fetch(
      `${process.env.STEADFAST_API_URL}/cancel_order/${consignmentId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.STEADFAST_API_KEY ?? '',
          'Secret-Key': process.env.STEADFAST_SECRET_KEY ?? '',
        },
      }
    );

    const data = (await response.json()) as DeliveryResponse;
    return data;
  } catch (error) {
    console.error('Error canceling delivery:', error);
    throw new Error('Failed to cancel delivery');
  }
};
