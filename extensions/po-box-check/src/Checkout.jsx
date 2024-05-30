import {
  reactExtension,
  TextField,
  useShippingAddress,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import React, { useState } from "react";
// Set the entry point for the extension
export default reactExtension("purchase.checkout.contact.render-after", () => <App />);

function App() {
  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const canBlockProgress = useExtensionCapability("block_progress");
  const translate = useTranslate();

  const address = useShippingAddress();

  const address1 = address.address1 ?? "";
  const address2 = address.address2 ?? "";
  const addressCity = address.city ?? "";

  const POBoxesText = ['P.O. Box', 'P.O Box', 'PO BOX', 'Packstation', 'BOX', 'Postfiliale', 'APO AE', 'FPO AE', 'APO', 'FPO', 'PO', 'P.O.', 'P.O'];

  const containsPOBox = (address) => {
    const words = address.toLowerCase().split(/\s+/);
    return POBoxesText.some(text => words.includes(text.toLowerCase()));
  };

  const containsPOBox1 = containsPOBox(address1);
  const containsPOBox2 = containsPOBox(address2);
  const containsPOBoxCity = containsPOBox(addressCity);

  // useBuyerJourneyIntercept(({ canBlockProgress }) => {
  //   if (!canBlockProgress) return
  //
  //   let errors = [];
  //
  //   if (containsPOBox1) {
  //     errors.push({
  //       message: translate('po_box_error'),
  //       target: '$.cart.deliveryGroups[0].deliveryAddress.address1'
  //     });
  //   }
  //
  //   if (containsPOBox2) {
  //     errors.push({
  //       message: translate('po_box_error'),
  //       target: '$.cart.deliveryGroups[0].deliveryAddress.address2'
  //     });
  //   }
  //
  //   if (containsPOBoxCity) {
  //     errors.push({
  //       message: translate('po_box_error'),
  //       target: '$.cart.deliveryGroups[0].deliveryAddress.city'
  //     });
  //   }
  //
  //   if (containsPOBox1 || containsPOBox2 || containsPOBoxCity) {
  //     return {
  //       behavior: "block",
  //       reason: "P.O Boxes",
  //       errors: errors
  //     };
  //   }
  //
  //   return {
  //     behavior: "allow"
  //   };
  // });
}
