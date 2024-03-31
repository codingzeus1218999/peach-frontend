import React from "react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { render, RenderResult } from "@testing-library/react";

import { ThemeProvider } from "@mui/material";
import theme from "../../styles/theme";

import { Provider, useDispatch } from "react-redux";

import { setupStore } from "../../store";
import type { AppStore, RootState } from "../../store";
import { PreloadedState } from "@reduxjs/toolkit";

export type Props = {
  [key: string]: any;
};

type CreateSetupParams = {
  component: any;
  props?: Props;
  state?: Partial<RootState>;
  selectors?: any;
  route?: string;
};

type SetupParams = {
  props?: Props;
  state?: Partial<RootState>;
};

export type Setup = RenderResult & {
  rerender: (rerenderParams: Props) => void;
  props?: Props;
  state?: Partial<RootState>;
  selectors?: any;
  newStore: AppStore;
};

export type SetupFunction = (params?: SetupParams) => Setup;

export default function createSetup(params: CreateSetupParams): SetupFunction {
  const {
    component: Component,
    props: initialProps = {},
    state = {} as Partial<RootState>,
    route: initialRoute = "/",
  } = params;

  try {
    const d = (a: any) => a;
      (useDispatch as jest.Mock).mockImplementation(() => d);
  } catch (error) {

  }

  return ({ props, state: newState }: SetupParams = {}): Setup => {
    const finalState = newState || state;
    const store = setupStore(finalState as PreloadedState<RootState>);

    const combinedProps = { ...initialProps, ...props };
    const WrappedComponent: React.FC<Props> = (p?: Props) => {
      return (
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <MemoryRouterProvider url={initialRoute}>
              <Component {...p} />
            </MemoryRouterProvider>
          </ThemeProvider>
        </Provider>
      );
    };

    const wrapper = render(<WrappedComponent {...combinedProps} />);

    const rerender = (rerenderParams: Props = {}): void => {
      const { rerenderProps } = rerenderParams;
      const newProps = {
        ...combinedProps,
        ...rerenderProps,
      };
      wrapper.rerender(<WrappedComponent {...newProps} />);
    };

    return {
      ...wrapper,
      rerender,
      props,
      newStore: store,
    };
  };
}

export const I18nMockedProps = {
  _nextI18Next: {
    initialI18nStore: {
      en: {},
    },
    initialLocale: "en",
    ns: [],
    userConfig: {
      i18n: {
        defaultLocale: "en",
        locales: ["en", "sv"],
      },
      react: {
        useSuspense: false,
      },
      ns: ["translations"],
      defaultNS: "translations",
      localePath: "/locales",
      default: {
        i18n: {
          defaultLocale: "en",
          locales: ["en", "sv"],
        },
        react: {
          useSuspense: false,
        },
        ns: ["translations"],
        defaultNS: "translations",
        localePath: "/locales",
      },
    },
  },
};
