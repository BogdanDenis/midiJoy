import React, { useState, useCallback } from 'react'
import { Field, FieldArray, Form, Formik } from 'formik';

import { useMappings, useMidi } from '../../../../hooks';
import { Button, Input, Select } from '../../../../components';

import css from './mappings-form.css';

const AVAILABLE_AXES = {
  'X': 'X',
  'Y': 'Y',
  'Z': 'Z',
  'RX': 'RX',
  'RY': 'RY',
  'RZ': 'RZ',
};

const MAX_VJOY_DEVICES = 16;

export const MappingsForm = ({ mappings }) => {
  const { onMIDIMessage } = useMidi();
  const { saveMappings } = useMappings();

  const handleAssignMIDIControl = useCallback((setFieldValue, mappingIndex) => {
    const unsubscribe = onMIDIMessage((message) => {
      const { keyId, keyType } = message;

      setFieldValue(`mappings.${mappingIndex}.keyId`, keyId);
      setFieldValue(`mappings.${mappingIndex}.keyType`, keyType);

      unsubscribe();
    });
  }, []);

  const vJoyDeviceOptions = new Array(MAX_VJOY_DEVICES).fill(null).map((_, index) => ({ value: index + 1, label: index + 1 }));
  const vJoyAxesOptions = Object.keys(AVAILABLE_AXES).map(axis => ({ value: axis, label: axis }));

  return (
    <Formik
      enableReinitialize
      initialValues={{ mappings }}
      onSubmit={(values) => {
        saveMappings(values.mappings);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <FieldArray
            name="mappings"
            render={(arrayHelpers) => (
              <>
                <div className={css.mappingsFormContainer}>
                  {values.mappings.map((mapping, index) => (
                    <div className={css.mappingsFormFieldsContainer}>
                      <Field
                        name={`mappings.${index}.keyType`}
                        type="hidden"
                      />
                      <Field
                        name={`mappings.${index}.keyId`}
                        type="hidden"
                      />

                      <Button
                        type="button"
                        onClick={() => handleAssignMIDIControl(setFieldValue, index)}
                      >
                        {
                          (mapping.keyId && mapping.keyType)
                            ? <span>assigned control: {mapping.keyId}. Click again to re-assign.</span>
                            : <span>assign control</span>
                        }
                      </Button>
                      <br />
                      <Field name={`mappings.${index}.vjdId`}>
                        {({ field }) => (
                          <Select
                            containerClass={css.vjdIdFieldContainer}
                            label="vJoy device"
                            dataOptions={vJoyDeviceOptions}
                            {...field}
                          />
                        )}
                      </Field>
                      <Field name={`mappings.${index}.vjdKey`}>
                        {({ field }) => (
                          <Select
                            containerClass={css.vjdKeyFieldContainer}
                            label="vJoy axis"
                            dataOptions={vJoyAxesOptions}
                            {...field}
                          />
                        )}
                      </Field>
                      <Button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  containerClass={css.addConfigButtonContainer}
                  onClick={() => arrayHelpers.insert(values.mappings.length, {})}
                >
                  +
                </Button>
              </>
            )}
          />
          <Button
            type="submit"
            containerClass={css.saveConfigButtonContainer}
          >
            Save mapping
          </Button>
        </Form>
      )}
    </Formik>
  )
}