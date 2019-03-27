// @flow
import * as React from 'react';
import * as models from '../../../models';
import autobind from 'autobind-decorator';
import CodeEditor from '../codemirror/code-editor';
import type { Request, RequestHeader } from '../../../models/request';

type Props = {
  onChange: Function,
  request: Request,
};

@autobind
class RequestScriptEditor extends React.PureComponent<Props> {
  constructor(props) {
    super(props);

    this.state = {
      scriptString: '// Write here your script',
      requestCompleted: false,
    };

    this._getScriptString();
  }

  _getScriptString() {
    models.requestScript.findByParentId(this.props.request._id).then(res => {
      if (res.length === 0) {
        this.setState(prev => ({ requestCompleted: true }));
      } else {
        this.setState(prev => ({ scriptString: res[0].script, requestCompleted: true }));
      }
    });
  }

  render() {
    const { scriptString, requestCompleted } = this.state;

    if (requestCompleted) {
      return (
        <div className="pad-bottom scrollable-container">
          <div className="scrollable">
            <CodeEditor onChange={this.props.onChange} defaultValue={scriptString} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default RequestScriptEditor;
