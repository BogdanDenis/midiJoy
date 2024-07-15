import React, { useState, useCallback } from 'react'
import { Field, FieldArray, Form, Formik } from 'formik';

import { useMappings, useMidi } from '../../../../hooks';

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
                {values.mappings.map((mapping, index) => (
                  <div>
                    <Field
                      name={`mappings.${index}.keyType`}
                      type="hidden"
                    />
                    <Field
                      name={`mappings.${index}.keyId`}
                      type="hidden"
                    />

                    <button type="button" onClick={() => handleAssignMIDIControl(setFieldValue, index)}>
                      {
                        (mapping.keyId && mapping.keyType)
                          ? <span>assigned control: {mapping.keyType} {mapping.keyId}. Click again to re-assign.</span>
                          : <span>assign control</span>
                      }
                    </button>
                    
                    <Field name={`mappings.${index}.vjdId`} type="number" min={1} max={16} />
                    <Field name={`mappings.${index}.vjdKey`} type="text" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => arrayHelpers.insert(values.mappings.length, {})}
                >
                  +
                </button>
              </>
            )}
          />
          <button type="submit">Save mapping</button>
        </Form>
      )}
    </Formik>
  )
}