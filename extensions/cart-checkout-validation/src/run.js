// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

// The configured entrypoint for the 'purchase.validation.run' extension target

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */

export function run(input) {
  const containsPOBox = (address) => {
    if (address === null) return false;

    // PO Boxes text
    const POBoxesText = ['P.O. Box', 'P.O Box', 'PO BOX', 'Packstation', 'BOX', 'Postfiliale', 'APO AE', 'FPO AE', 'APO', 'FPO', 'PO', 'P.O.', 'P.O'];
    const words = address.toLowerCase().split(/\s+/);
    return POBoxesText.some(text => words.includes(text.toLowerCase()));
  };

  const containsPOBox1 = input.cart.deliveryGroups ? containsPOBox(input.cart.deliveryGroups[0]?.deliveryAddress.address1) : '';
  const containsPOBox2 = input.cart.deliveryGroups ? containsPOBox(input.cart.deliveryGroups[0]?.deliveryAddress.address2) : '';
  const containsPOBoxCity = input.cart.deliveryGroups ? containsPOBox(input.cart.deliveryGroups[0]?.deliveryAddress.city) : '';

  const errors = [];

  if (containsPOBox1) {
    errors.push({
      localizedMessage: translate('po_box_error'),
      target: '$.cart.deliveryGroups[0].deliveryAddress.address1'
    });
  }

  if (containsPOBox2) {
    errors.push({
      localizedMessage: translate('po_box_error'),
      target: '$.cart.deliveryGroups[0].deliveryAddress.address2'
    });
  }

  if (containsPOBoxCity) {
    errors.push({
      localizedMessage: translate('po_box_error'),
      target: '$.cart.deliveryGroups[0].deliveryAddress.city'
    });
  }

  return { errors };
};
