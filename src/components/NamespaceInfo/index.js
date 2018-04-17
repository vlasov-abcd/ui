/* @flow */

import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { routerLinks } from '../../config';
import ns from '../../images/n.png';
// import type { ReduxState } from '../../types';
// import * as actionDeleteNamespace from '../../actions/namespaceActions/deleteNamespace';
// import * as actionGetNamespaceUsersAccess from '../../actions/namespaceActions/getNamespaceUsersAccess';
// import * as actionGetNamespaces from '../../actions/namespacesActions/getNamespaces';
// import * as actionGetNamespace from '../../actions/namespaceActions/getNamespace';

type Props = {
  data: Object,
  idName: string,
  dataAccess: Object,
  handleDeleteNamespace: (idName: string) => void
};

const NamespaceInfo = ({
  data,
  idName,
  handleDeleteNamespace,
  dataAccess
}: Props) => {
  const { memory, cpu } = data.resources.used;
  const { memory: memoryLimit, cpu: cpuLimit } = data.resources.hard;
  const owner = 'owner';
  const read = 'read';
  const write = 'write';
  return (
    <div className="content-block-container content-block_common-statistic container">
      <div className="content-block-header">
        <div className="content-block-header-label content-block-header-label__namspace-info">
          <div className="content-block-header-label__text content-block-header-label_main content-block-header-label__text_namspace-info">
            {idName}
          </div>
          <div className="content-block-header-label__descript">namespace</div>

          {dataAccess.new_access_level === owner && (
            <div className="badge namspaceinfo-badge namspaceinfo-badge__admin">
              access: {dataAccess.new_access_level}
            </div>
          )}

          {dataAccess.new_access_level === read && (
            <div className="badge namspaceinfo-badge namspaceinfo-badge__read">
              access: {dataAccess.new_access_level}
            </div>
          )}

          {dataAccess.new_access_level === write && (
            <div className="badge namspaceinfo-badge namspaceinfo-badge__write">
              access: {dataAccess.new_access_level}
            </div>
          )}
        </div>
        <div className="content-block-header-extra-panel">
          <div className="content-block-header-extra-panel dropdown no-arrow">
            <i
              className="content-block-header__more ion-more dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            />
            <ul className="dropdown-menu dropdown-menu-right" role="menu">
              <NavLink
                activeClassName="active"
                className="dropdown-item"
                to={routerLinks.resizeNamespaceLink(idName)}
              >
                Resize
              </NavLink>
              <button
                className="dropdown-item text-danger"
                onClick={() => handleDeleteNamespace(idName)}
              >
                Delete
              </button>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-block-content content-block-content__namspaceinfo">
        <div className="content-block__r-img">
          <img src={ns} alt="ns" />
        </div>
        <div className="content-block__info-item">
          <div className="content-block__info-name">
            RAM ( Usage / Total ) :{' '}
          </div>
          <div className="content-block__info-text">
            {memory} / {memoryLimit}
          </div>
        </div>
        <div className="content-block__info-item">
          <div className="content-block__info-name">
            CPU ( Usage / Total ) :{' '}
          </div>
          <div className="content-block__info-text">
            {cpu} / {cpuLimit}
          </div>
        </div>
        <div className="content-block__info-item">
          <div className="content-block__info-name">
            Volume ( Usage / Total ) :
          </div>
          <div className="content-block__info-text">- / -</div>
        </div>
        {dataAccess.new_access_level === owner && (
          <div className="content-block__info-item content-block__info-item_namspaceinfo">
            <Link to={routerLinks.membership}>
              <div className="content-block__info-text content-block__info-text_namspaceinfo">
                Manage Team
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NamespaceInfo;
