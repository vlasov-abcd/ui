/* @flow */

import React from 'react';
import className from 'classnames/bind';

import InputControl from '../../../InputControl';

import globalStyles from '../../../../theme/global.scss';
import inputStyles from '../../../../components/InputControl/index.scss';

const globalClass = className.bind(globalStyles);

const titleClassName = globalClass('containerTitle', 'containerTitleBlock');
const formClassName = globalClass('formInputText', 'formControl');

type Props = {
  item: Object,
  index: number,
  handleChangeInputParameters: (
    value: string,
    id: string,
    index: number,
    type: string
  ) => void
};

// const patternOne = new RegExp('^d+(.d+)?m$');
// const patternTwo = new RegExp('/^0.d/');
// const pattern = '/^(0.d|^d+(.d+)?m$)$';
const Parameters = ({ item, index, handleChangeInputParameters }: Props) => {
  const { id, limits } = item;
  return (
    <div
      className={`${globalStyles.rowLine} row`}
      id={`container${index + 1}-parameters`}
    >
      <div className="col-md-12">
        <div className={titleClassName}>
          <span className={globalStyles.containerTitleStar}>*</span> Parameters
          {/* <Tooltip */}
          {/* placement='top' */}
          {/* trigger={['hover']} */}
          {/* overlay={<span>Text of notificatiorem ipsum alist delor set. Text of <br/>notification. Lore ipsum delor upset ore ipsum delor <br/>upset</span>} */}
          {/* > */}
          {/* <span className="myTooltip" data-toggle="tooltip">?</span> */}
          {/* </Tooltip> */}
        </div>
      </div>
      <div className={`${globalStyles.columnCustom} col-md-5`}>
        <InputControl
          value={limits.cpu}
          id={`cpu${id}`}
          type="number"
          pattern="(3000|[12][0-9]{3}|[1-9][0-9]{1,2})"
          required
          min="10"
          max="3000"
          baseClassName={`${formClassName} ${inputStyles.inputCustom}`}
          baseClassNameLabel={`${globalStyles.formGroupLabel} ${
            limits.cpu || limits.cpu === 0
              ? globalStyles.formGroupLabelOnFocus
              : ''
          }`}
          labelText="CPU"
          title="Range: 10 - 3000"
          textHelper="Range: 10 - 3000"
          baseClassNameHelper={globalStyles.formGroupHelper}
          handleChangeInput={e => {
            const cpuValue = parseInt(e.target.value, 10);
            handleChangeInputParameters(
              Number.isInteger(cpuValue) ? cpuValue : '',
              id,
              index,
              'cpu'
            );
          }}
        />
      </div>

      <div className={`${globalStyles.columnCustom} col-md-5`}>
        <InputControl
          value={limits.memory}
          id={`ram${id}`}
          type="number"
          pattern="(8000|[1-7][0-9]{3}|[1-9][0-9]{1,2})"
          required
          min="10"
          max="8000"
          baseClassName={`${formClassName} ${inputStyles.inputCustom}`}
          baseClassNameLabel={`${globalStyles.formGroupLabel} ${
            limits.memory || limits.memory === 0
              ? globalStyles.formGroupLabelOnFocus
              : ''
          }`}
          labelText="RAM"
          title="Range: 10 - 8000"
          textHelper="Range: 10 - 8000"
          baseClassNameHelper={globalStyles.formGroupHelper}
          handleChangeInput={e => {
            const cpuValue = parseInt(e.target.value, 10);
            handleChangeInputParameters(
              Number.isInteger(cpuValue) ? cpuValue : '',
              id,
              index,
              'memory'
            );
          }}
        />
      </div>
    </div>
  );
};

export default Parameters;
