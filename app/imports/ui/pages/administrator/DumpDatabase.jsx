import React from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { dumpDatabaseMethod } from '../../../api/base/BaseCollection.methods';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

class DumpDatabase extends React.Component {
  handleClick() {
    dumpDatabaseMethod.call((error, result) => {
      if (error) {
        console.error('Problem dumping database.', error);
      } else {
        const zip = new ZipZap();
        const dir = 'hacchui-db';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  }

  render() {
    return (
    <Segment>
      <Button onClick={this.handleClick}>Dump the Database</Button>
    </Segment>
    );
  }
}

export default DumpDatabase;
