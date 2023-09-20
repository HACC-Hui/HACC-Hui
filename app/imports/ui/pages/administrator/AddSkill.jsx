import React from 'react';
import { Container, Col, Card } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
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

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddSkill = () => {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data, formRef) => {
    const { name, description } = data;
    const definitionData = { name, description };
    const collectionName = Skills.getCollectionName();
    // console.log(collectionName);
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
            // console.log('Success');
          }
        });
  };

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Container fluid>
          <Col>
            <h2 style={{ textAlign: 'center' }}>Add a skill</h2>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
              <Card>
                <TextField name='name' />
                <TextField name='description' />
                <SubmitField value='Submit' />
                <ErrorsField />
              </Card>
            </AutoForm>
          </Col>
        </Container>
    );
};

export default AddSkill;
