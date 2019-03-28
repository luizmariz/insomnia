import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem } from '../base/dropdown';
import StatusTag from '../tags/status-tag';
import URLTag from '../tags/url-tag';
import TimeTag from '../tags/time-tag';
import SizeTag from '../tags/size-tag';
import classnames from 'classnames';
import Tooltip from '../tooltip';

@autobind
class RunnerTestLogDropdown extends PureComponent {
  render() {
    const { response } = this.props;
    return (
      <div key={response.response.url} style={{ paddingBottom: 10 }}>
        <Dropdown>
          <DropdownButton title="Tests log">
            <i className="fa fa-clock-o" />
            <i className="fa fa-caret-down" />
          </DropdownButton>

          <DropdownDivider>TESTS OK</DropdownDivider>

          {response.test.tests.length !== 0 ? (
            response.test.tests.map(
              test =>
                test.result ? (
                  <DropdownItem>
                    <strong>{test.title + '  '}</strong>
                  </DropdownItem>
                ) : null,
            )
          ) : (
            <DropdownItem>There is no tests to run</DropdownItem>
          )}

          <DropdownDivider>FAILED TESTS</DropdownDivider>

          {response.test.tests.length !== 0 ? (
            response.test.tests.map(
              test =>
                !test.result ? (
                  <DropdownItem>
                    <strong>{test.title}</strong>
                    {': ' + test.text + '  '}
                  </DropdownItem>
                ) : null,
            )
          ) : (
            <DropdownItem>There is no tests to run</DropdownItem>
          )}
        </Dropdown>

        <div
          style={{ marginLeft: 5 }}
          className={classnames('tag', response.test.status ? 'bg-success' : 'bg-danger', {
            'tag--small': false,
          })}>
          <Tooltip
            message={response.test.status ? 'All tests are OK' : 'Some test is failing'}
            position="bottom">
            {response.test.status ? 'PASSED' : 'FAILED'}
          </Tooltip>
        </div>

        <StatusTag
          statusCode={response.response.statusCode}
          statusMessage={response.response.statusMessage || null}
        />
        <URLTag url={response.response.url} />
        <TimeTag milliseconds={response.response.elapsedTime} />
        <SizeTag bytesRead={response.response.bytesRead} bytesContent={response.bytesContent} />
      </div>
    );
  }
}

RunnerTestLogDropdown.propTypes = {
  response: PropTypes.object,
};

export default RunnerTestLogDropdown;
