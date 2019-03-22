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

type Props = {
  workspaces: Array<Workspace>,
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
    };
  }

  _setModalRef(n: ?Modal) {
    this.modal = n;
  }

  show(options: { requestGroup: RequestGroup }) {
    const { requestGroup } = options;
    this.setState({ requestGroup });
    this.modal && this.modal.show();
  }

  hide() {
    this.modal && this.modal.hide();
  }

  render() {
    const { passed, failed } = this.state;
    return (
      <Modal ref={this._setModalRef} {...this.props}>
        <ModalHeader key="header">Runner</ModalHeader>
        <ModalBody key="body" className="pad">
          <div className="form-control form-control--outlined">
            <label>
              Request Group Runner&nbsp;
              <HelpTooltip>Runner allows you to run your test cases</HelpTooltip>
            </label>
          </div>
        </ModalBody>
        <ModalFooter key="footer">
          <button disabled className="pad">
            Passed: {passed}
          </button>
          <button disabled>Failed: {failed}</button>
          <button type="submit" className="btn">
            Run
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RunnerRequestGroupModal;
