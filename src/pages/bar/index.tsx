import React, { FC } from 'react';
import BarDom from './components/bar-dom';
import styles from './index.less';

interface BarProps {}

const Bar: FC<BarProps> = (props) => {

  return (
    <div className={styles['bar-chart']}>
      <div className={styles['svg-dom']}>
        <p>svg 操作dom版本</p>
        <div style={{ height: 600 }}>
          <BarDom />
        </div>
      </div>
    </div>
  );
}

export default React.memo(Bar);
