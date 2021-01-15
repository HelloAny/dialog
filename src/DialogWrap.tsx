import * as React from 'react';
import Portal from 'rc-util/lib/PortalWrapper';
import Dialog, { IDialogChildProps } from './Dialog';
import { IDialogPropTypes } from './IDialogPropTypes';

// fix issue #10656
/*
 * getContainer remarks
 * Custom container should not be return, because in the Portal component, it will remove the
 * return container element here, if the custom container is the only child of it's component,
 * like issue #10656, It will has a conflict with removeChild method in react-dom.
 * So here should add a child (div element) to custom container.
 * */

const DialogWrap: React.FC<IDialogPropTypes> = (props: IDialogPropTypes) => {
  const { visible, getContainer, forceRender, destroyOnClose = false, afterClose } = props;
  const [forceRenderTime, setForceRenderTime] = React.useState<boolean>(forceRender);
  const [animatedVisible, setAnimatedVisible] = React.useState<boolean>(visible);

  React.useEffect(() => {
    if (visible) {
      setAnimatedVisible(true);
      if (destroyOnClose) {
        setForceRenderTime(false);
      }
    }
  }, [visible]);

  React.useEffect(() => {
    setForceRenderTime(forceRender);
  }, [forceRender]);

  // 渲染在当前 dom 里；
  if (getContainer === false) {
    return (
      <Dialog
        {...props}
        getOpenCount={() => 2} // 不对 body 做任何操作。。
      />
    );
  }

  // Destroy on close will remove wrapped div
  if (!forceRenderTime && destroyOnClose && !animatedVisible) {
    return null;
  }

  return (
    <Portal visible={visible} forceRender={forceRenderTime} getContainer={getContainer}>
      {(childProps: IDialogChildProps) => (
        <Dialog
          {...props}
          forceRender={forceRenderTime}
          destroyOnClose={destroyOnClose}
          afterClose={() => {
            afterClose?.();
            setAnimatedVisible(false);
          }}
          {...childProps}
        />
      )}
    </Portal>
  );
};

DialogWrap.displayName = 'Dialog';

export default DialogWrap;
