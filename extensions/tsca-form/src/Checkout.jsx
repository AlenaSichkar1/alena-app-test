import {
  reactExtension,
  BlockStack,
  View,
  Heading,
  Checkbox,
  useShippingAddress,
  useCartLines,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import React, { useState } from "react";
// Set the entry point for the extension
export default reactExtension("purchase.checkout.shipping-option-list.render-after", () => <App />);

function App() {
  // Set the target age that a buyer must be to complete an order
  const address = useShippingAddress();
  const countryCode = address.countryCode;
  const isUSA = countryCode === 'US';

  const cartLines = useCartLines();
  const hasTSCAFormProduct = cartLines.some((product) =>
    product.attributes.some((attribute) => attribute.key === '_TSCA_form')
  );

  const [validationError, setValidationError] = useState("");

  let tscaCheck = true;
  if (isUSA && hasTSCAFormProduct) {
    tscaCheck = false;
  }

  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const canBlockProgress = useExtensionCapability("block_progress");
  const translate = useTranslate();

  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {

    if (!tscaCheck) {
      return {
        behavior: "block",
        reason: "TSCA checkbox is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationError("TSCA checkbox is required");
          }
        }
      }
    }

    return {
      behavior: "allow",
      perform: () => {
        // Ensure any errors are hidden
        clearValidationErrors();
      },
    };
  });

  function blockButton(event) {
    tscaCheck = event;
  }

  function clearValidationErrors() {
    setValidationError("");
  }

  // Render the extension
  if (isUSA && hasTSCAFormProduct) {
    return (
      <>
        <BlockStack padding='base'></BlockStack>
        <View
          border='base'
          padding='base'
        >
          <Heading
            level="2"
          >
            {translate('TSCA_form_title')}
          </Heading>
          <BlockStack padding='tight'></BlockStack>
          <Checkbox
            id="tsca_checkbox"
            onChange={blockButton}
            value={tscaCheck}
            error={validationError}
            required="true"
          >
            {translate('TSCA_form_text')}
          </Checkbox>
        </View>
      </>
    );
  }
}
