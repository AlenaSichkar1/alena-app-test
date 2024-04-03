import React, { useState } from "react";
import {
  BlockStack,
  TextBlock,
  useApi,
  useTranslate,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

// export default reactExtension("purchase.checkout.block.render", () => <Extension />);
export default reactExtension("purchase.checkout.shipping-option-list.render-before", () => <Extension />);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();

  return (
    <BlockStack>
      <TextBlock title="shipping-text">
        {translate('delayed_order_text')}
      </TextBlock>
    </BlockStack>
  );
}
