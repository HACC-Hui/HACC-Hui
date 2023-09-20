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
import { Skills } from '../../../api/skill/SkillCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  name: String,
  description: String,
});
const formSchema = new SimpleSchema2Bridge(schema);

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddSkill = () => {
  const formRef = useRef(null);

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  const handleSubmit = useCallback(
      (data) => {
        const { name, description } = data;
        const definitionData = { name, description };
        const collectionName = Skills.getCollectionName();
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
      <Container id="add-skill-page">
        <h2 className="text-center fw-bold">Add a Skill</h2>
        <AutoForm ref={formRef} schema={formSchema} onSubmit={handleSubmit}>
          <div className="border p-3">
            <TextField name="name" />
            <TextField name="description" />
            <SubmitField value="Submit" />
            <ErrorsField />
          </div>
        </AutoForm>
      </Container>
  );
};

export default AddSkill;
