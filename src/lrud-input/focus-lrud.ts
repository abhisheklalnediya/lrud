import throttle from './throttle';
import { keyToBindingMap, keyCodeToBindingMap } from './key-to-binding-map';
import { FocusStore } from '../types';

export default function focusLrud(focusStore: FocusStore) {
  const lrudMapping = {
    up() {
      focusStore.processKey.up();
    },

    down() {
      focusStore.processKey.down();
    },

    left() {
      focusStore.processKey.left();
    },

    right() {
      focusStore.processKey.right();
    },

    select() {
      focusStore.processKey.select();
    },

    back() {
      focusStore.processKey.back();
    },
  };

  function subscribe(throttleWait: number = 0) {
    const keydownHandler = throttle(
      function (e: KeyboardEvent) {
        const bindingName =
          // @ts-ignore
          keyToBindingMap[e.key] || keyCodeToBindingMap[e.keyCode];
        // @ts-ignore
        const binding = lrudMapping[bindingName];

        if (typeof binding === 'function') {
          e.preventDefault();
          e.stopPropagation();

          binding();
        }
      },
      // TODO: support throttling. Ideally on a per-node basis.
      throttleWait,
      {
        trailing: false,
      }
    );
    window.addEventListener('keydown', keydownHandler);
    function unsubscribe() {
      window.removeEventListener('keydown', keydownHandler);
    }
    return unsubscribe;
  }

  return {
    subscribe,
  };
}
