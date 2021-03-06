/* @flow */

import React from 'react';
import className from 'classnames/bind';
import { NavLink } from 'react-router-dom';

import { routerLinks, sourceType } from '../../config';
import InputControl from '../InputControl';
import CheckBoxControl from '../CheckBoxControl';

import globalStyles from '../../theme/global.scss';
import inputStyles from '../../components/InputControl/index.scss';
import buttonsStyles from '../../theme/buttons.scss';

const globalClass = className.bind(globalStyles);

const formClassName = globalClass('formInputText', 'formControl');

const containerClassName = globalClass('blockContainer', 'paddingX20');

const nextContainerClassName = globalClass(
  'containerTitle',
  'containerTitleBlock'
);

const selectClassName = globalClass('selectCustom', 'selectGreyColor');

const textHelperClassName = globalClass('textHelper', 'isHidden');

type Props = {
  currentService: Object,
  servicesList: Array<Object>,
  currentPort: Object,
  portsList: Array<Object>,
  domainName: string,
  domainPath: string,
  isEnabledSSL: boolean,
  match: Object,
  // history: Object,
  handleChangeSelectService: (value: string) => void,
  handleChangeSelectPort: (value: string) => void,
  handleChangeInput: (value: string, type: string) => void,
  handleChangeCheckBox: () => void
};

const isOnline = sourceType === 'ONLINE';

const CreateDomainCard = ({
  currentService,
  servicesList,
  currentPort,
  portsList,
  domainName,
  domainPath,
  match,
  // history,
  isEnabledSSL,
  handleChangeSelectService,
  handleChangeSelectPort,
  handleChangeInput,
  handleChangeCheckBox
}: Props) => (
  <div className={containerClassName} id="target-deployment">
    <div className={`${globalStyles.rowLine} row`}>
      <div className="col-md-12">
        <div
          className={globalStyles.containerTitle}
          style={{ display: 'block' }}
        >
          Target Service
        </div>

        {servicesList.length > 0 ? (
          <div
            className="col-md-4"
            style={{ display: 'inline-block', paddingLeft: 0 }}
          >
            <div
              style={{ margin: '30px 0px 5px' }}
              className={globalStyles.containerSubTitleCreate}
            >
              External Service Name
            </div>
            <div className={globalStyles.selectWrapper}>
              <div className={globalStyles.selectArrow} />
              <div className={globalStyles.selectArrow} />
              <select
                name="services"
                className={selectClassName}
                value={currentService && currentService.name}
                onChange={e => handleChangeSelectService(e.target.value)}
                required
                disabled={match.params.idSrv}
              >
                {servicesList.map(item => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '30px' }}>
            <NavLink
              to={routerLinks.createServiceLink(match.params.idName)}
              className={buttonsStyles.buttonUICreateSmall}
            >
              Create Service
            </NavLink>
          </div>
        )}

        {servicesList.length > 0 && (
          <div
            className="col-md-4"
            style={{ display: 'inline-block', marginLeft: '20px' }}
          >
            <div
              style={{ margin: '30px 0px 5px' }}
              className={globalStyles.containerSubTitleCreate}
            >
              Target port
            </div>
            {portsList && (
              <div className={globalStyles.selectWrapper}>
                <div className={globalStyles.selectArrow} />
                <div className={globalStyles.selectArrow} />
                <select
                  name="ports"
                  className={selectClassName}
                  value={currentPort && currentPort.port}
                  onChange={e => handleChangeSelectPort(e.target.value)}
                  required
                >
                  {portsList.map(
                    port =>
                      port.protocol === 'TCP' && (
                        <option key={port.port} value={port.port}>
                          {port.port}
                        </option>
                      )
                  )}
                </select>
              </div>
            )}
            {!portsList && (
              <div className={globalStyles.selectWrapper}>
                <div className={globalStyles.selectArrow} />
                <div className={globalStyles.selectArrow} />
                <select name="ports" className={selectClassName} required>
                  <option
                    key={servicesList[0].ports[0].port}
                    value={
                      servicesList.length !== 0 && servicesList[0].ports[0].port
                    }
                  >
                    {servicesList.length !== 0 && servicesList[0].ports[0].port}
                  </option>
                </select>
              </div>
            )}
          </div>
        )}

        <div className={textHelperClassName}>
          Select the deployment for which the Service applies
        </div>
      </div>
    </div>
    <div
      className={`${globalStyles.rowLine} row`}
      style={{ borderBottom: 'none', paddingBottom: '20px' }}
    >
      <div className="col-md-7">
        <div className={nextContainerClassName}>
          <span className={globalStyles.containerTitleStar}>*</span> Domains
        </div>
        <InputControl
          value={domainName}
          id="domainName"
          type="text"
          required
          baseClassName={`form-group__input-text form-control customInput ${isOnline &&
            'customInputDomain'}`}
          baseClassNameLabel={`form-group__label ${domainName &&
            'form-group__label-always-onfocus'}`}
          labelText="Domain"
          baseClassNameHelper={globalStyles.formGroupHelper}
          handleChangeInput={e => {
            // e.target.setSelectionRange(-domainName.length, -domainName.length);
            handleChangeInput(e.target.value, 'domainName');
          }}
          alwaysVisiblePlaceholder={
            isOnline && 'customAlwaysVisiblePlaceholder'
          }
        />
        <InputControl
          value={domainPath}
          id="domainPath"
          type="text"
          baseClassName={`${formClassName} ${inputStyles.Domain} ${
            inputStyles.DomainPath
          }`}
          baseClassNameLabel={`${globalStyles.formGroupLabel} ${domainPath &&
            globalStyles.formGroupLabelOnFocus}`}
          labelText="Path"
          title="Path that the External Service watches to route traffic"
          textHelper="Path that the External Service watches to route traffic"
          baseClassNameHelper={globalStyles.formGroupHelper}
          handleChangeInput={e =>
            handleChangeInput(e.target.value, 'domainPath')
          }
          alwaysVisiblePlaceholder="customAlwaysVisibleInputPathPlaceholder"
        />
        <div style={{ marginTop: '40px' }}>
          <div
            className="col-md-6"
            style={{ display: 'inline-block', paddingLeft: 0 }}
          >
            <CheckBoxControl
              id="ssl"
              value={isEnabledSSL}
              labelText="Enable SSL Security"
              labelClassName={globalStyles.labelCustom}
              handleChangeCheckBox={handleChangeCheckBox}
            />
          </div>
          {isEnabledSSL && (
            <div
              className={`${globalStyles.selectWrapper} col-md-6`}
              style={{ display: 'inline-block' }}
            >
              <div className={globalStyles.selectArrow} />
              <div className={globalStyles.selectArrow} />
              <select
                name="encrypt"
                className={selectClassName}
                value="Let`s Encrypt"
                disabled
                onChange={() => console.log('Let`s Encrypt')}
              >
                <option key="Let`s Encrypt" value="Let`s Encrypt">
                  Let`s Encrypt
                </option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default CreateDomainCard;
