import React, { useState } from 'react';
import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  Text,
  TextContent,
  TextInput,
} from '@patternfly/react-core';
import { useApiAlert } from '@app/utils/useApiAlert';
import { useCaches } from '@app/services/dataContainerHooks';
import {ConsoleServices} from "@services/ConsoleServices";

/**
 * Delete cache modal
 */
const DeleteCache = (props: {
  cacheName: string;
  isModalOpen: boolean;
  closeModal: (boolean) => void;
}) => {
  const { addAlert } = useApiAlert();
  const { reloadCaches } = useCaches();

  const [isValidCacheNameValue, setIsValidCacheNameValue] = useState<
    'success' | 'error' | 'default'
  >('default');
  const [cacheNameFormValue, setCacheNameFormValue] = useState('');

  const clearDeleteCacheModal = (deleteDone: boolean) => {
    setIsValidCacheNameValue('default');
    setCacheNameFormValue('');
    props.closeModal(deleteDone);
  };

  const handleCacheNameToDeleteInputChange = (value) => {
    setCacheNameFormValue(value);
  };
  const handleDeleteButton = () => {
    let trim = cacheNameFormValue.trim();
    setCacheNameFormValue(trim);
    if (trim.length == 0) {
      setIsValidCacheNameValue('error');
      return;
    }

    let validCacheName = trim === props.cacheName;
    setIsValidCacheNameValue(validCacheName ? 'success' : 'error');
    if (validCacheName) {
      ConsoleServices.caches().deleteCache(props.cacheName).then((actionResponse) => {
        clearDeleteCacheModal(actionResponse.success);
        addAlert(actionResponse);
        reloadCaches();
      });
    }
  };

  return (
    <Modal
      titleIconVariant={'warning'}
      className="pf-m-redhat-font"
      width={'50%'}
      isOpen={props.isModalOpen}
      title="Permanently delete cache?"
      onClose={() => clearDeleteCacheModal(false)}
      aria-label="Delete cache modal"
      description={
        <TextContent>
          <Text>
            <strong>'{props.cacheName}'</strong> and all of its data will be deleted.
          </Text>
        </TextContent>
      }
      actions={[
        <Button
          key="confirm"
          variant={ButtonVariant.danger}
          onClick={handleDeleteButton}
          isDisabled={cacheNameFormValue == ''}
        >
          Delete
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={() => clearDeleteCacheModal(false)}
        >
          Cancel
        </Button>,
      ]}
    >
      <Form>
        <FormGroup
          label="Enter the cache name to delete it."
          helperTextInvalid="Cache names do not match."
          fieldId="cache-to-delete"
          validated={isValidCacheNameValue}
        >
          <TextInput
            validated={isValidCacheNameValue}
            value={cacheNameFormValue}
            id="cache-to-delete"
            aria-describedby="cache-to-delete-helper"
            onChange={handleCacheNameToDeleteInputChange}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

export { DeleteCache };
