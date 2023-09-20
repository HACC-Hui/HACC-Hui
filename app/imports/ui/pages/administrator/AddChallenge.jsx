import React, { useCallback, useRef } from 'react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import { Container } from 'react-bootstrap';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  title: String,
  description: String,
  submissionDetail: String,
  pitch: String,
});
const formSchema = new SimpleSchema2Bridge(schema);

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddChallenge = () => {
  const formRef = useRef(null);

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  const handleSubmit = useCallback(
      (data) => {
        const { title, description, submissionDetail, pitch } = data;
        const definitionData = { title, description, submissionDetail, pitch };
        const collectionName = Challenges.getCollectionName();
        // console.log(collectionName);
        defineMethod.call({ collectionName, definitionData }, (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            console.error(error.message);
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.current.reset();
            // console.log('Success');
          }
        });
      },
      [formRef],
  );

  return (
      <Container id="add-challenge-page">
        <h2 className="text-center fw-bold">Add a Challenge</h2>
        <AutoForm ref={formRef} schema={formSchema} onSubmit={handleSubmit}>
          <div className="border p-3">
            <TextField name="title" />
            <TextField name="description" />
            <TextField name="submissionDetail" />
            <TextField name="pitch" />
            <SubmitField value="Submit" />
            <ErrorsField />
          </div>
        </AutoForm>
      </Container>
  );
};

export default AddChallenge;
