// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Modal from '../base/modal';
import ModalBody from '../base/modal-body';
import ModalHeader from '../base/modal-header';
import ModalFooter from '../base/modal-footer';
import type { RequestGroup } from '../../../models/request-group';
import type { Workspace } from '../../../models/workspace';
import * as models from '../../../models';
import HelpTooltip from '../help-tooltip';
import { all } from '../../../models/request';
import { getLatestForRequest } from '../../../models/response';
import { DropdownItem } from '../base/dropdown';
import RunnerTestLogDropdown from '../dropdowns/runner-test-log-dropdown';
import iconv from 'iconv-lite';
import In from '../../../in';

type Props = {
  workspaces: Array<Workspace>,
  activeEnvironment: Environment | null,
  activeRequest: ?Request,
  activeResponse: ?Response,
  workspaces: Array<Workspace>,
  handleSendRequestWithEnvironment: Function,
};

type State = {
  requestGroup: RequestGroup | null,
  selectedWorkspaceId: string | null,
};

@autobind
class RunnerRequestGroupModal extends React.PureComponent<Props, State> {
  modal: ?Modal;

  constructor(props: Props) {
    super(props);

    this.state = {
      requestGroup: null,
      selectedWorkspaceId: null,
      passed: 0,
      failed: 0,
      responses: [],
    };
  }

  _setModalRef(n: ?Modal) {
    this.modal = n;
  }

  show(options: { requestGroup: RequestGroup }) {
    const { requestGroup } = options;
    this.setState({ requestGroup, responses: [], passed: 0, failed: 0 });
    this.modal && this.modal.show();
  }

  hide() {
    this.modal && this.modal.hide();
  }

  _decodeIconv(bodyBuffer: Buffer, charset: string): string {
    try {
      return iconv.decode(bodyBuffer, charset);
    } catch (err) {
      console.warn('[response] Failed to decode body', err);
      return bodyBuffer.toString();
    }
  }

  _handleSendRequestsWithActiveEnvironment(): void {
    this.setState(prev => ({ responses: [], passed: 0, failed: 0 }));
    all().then(res => {
      const { activeEnvironment, handleSendRequestWithEnvironment } = this.props;
      const { requestGroup } = this.state;

      res.forEach(request => {
        const requestId = request ? request._id : 'n/a';
        const activeEnvironmentId = activeEnvironment ? activeEnvironment._id : 'n/a';
        getLatestForRequest(requestId).then(response => {
          if (request.parentId == requestGroup._id) {
            handleSendRequestWithEnvironment(requestId, activeEnvironmentId);

            this._handleTests(response, request).then(test => {
              this.setState(prev => ({
                responses: [...prev.responses, { response, test }],
                passed: test.status ? prev.passed + 1 : prev.passed,
                failed: test.status ? prev.failed : prev.failed + 1,
              }));
            });
          }
        });
      });
    });
  }

  async _handleTests(response, request) {
    const tests = (await models.requestScript.findByParentId(request._id))[0];

    if (tests) {
      const bodyBuffer = models.response.getBodyBuffer(response);
      const match = response.contentType.match(/charset=([\w-]+)/);
      const charset = match && match.length >= 2 ? match[1] : 'utf-8';
      const body = JSON.parse(this._decodeIconv(bodyBuffer, charset));
      response = { ...response, body: body };
      const i = new In();

      eval(tests.script);

      let allTestsPassed = true;
      i.getTests().forEach(test => {
        if (!test.result) {
          allTestsPassed = false;
        }
      });

      return { status: allTestsPassed, tests: i.getTests() };
    } else {
      return { status: true, tests: [] };
    }
  }

  render() {
    const { passed, failed, responses } = this.state;

    return (
      <Modal ref={this._setModalRef} {...this.props}>
        <ModalHeader key="header">Runner</ModalHeader>
        <ModalBody key="body" className="pad">
          <div className="form-control form-control--outlined">
            <label style={{ paddingBottom: 20 }}>
              Request Group Runner&nbsp;
              <HelpTooltip>Runner allows you to run your test cases</HelpTooltip>
            </label>
            <DropdownItem>
              {responses.map(response => <RunnerTestLogDropdown response={response} />)}
            </DropdownItem>
          </div>
        </ModalBody>
        <ModalFooter key="footer">
          <button disabled className="pad">
            Passed: {passed}
          </button>
          <button disabled>Failed: {failed}</button>
          <button
            type="submit"
            className="btn"
            onClick={this._handleSendRequestsWithActiveEnvironment}>
            Run
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RunnerRequestGroupModal;
