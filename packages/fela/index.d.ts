declare module "fela" {

  import React from 'react';

  type TRuleProps = {};
  type TRule = (props: TRuleProps) => IStyle; 
  type TKeyFrame = TRule;
  type TRendererCreator = (config?: IConfig) => IRenderer;
  type TPlugin = (style: IStyle) => IStyle; //http://fela.js.org/docs/advanced/Plugins.html
  type TEnhancer = (renderer: IRenderer) => IRenderer; //http://fela.js.org/docs/advanced/Enhancers.html

  const enum TSubscribeMessageType {
    rule = 1,
    staticObject = 1,
    keyframes = 2,
    fontFace = 3,
    staticString = 4,
    clear = 5
  }
  interface TSubscribeMessage {
    type: TSubscribeMessageType;
  }
  interface TSubscribeRuleMessage extends TSubscribeMessage { static?: boolean; declaration: string; selector: string; media: string; }
  interface TSubscribeKeyframesMessage extends TSubscribeMessage { name: string; keyframe: string; }
  interface TSubscribeFontFaceMessage extends TSubscribeMessage { fontFamily: string; fontFace: string; }
  interface TSubscribeStaticStringMessage extends TSubscribeMessage { css: string; }
  interface TSubscribeClearMessage extends TSubscribeMessage { }

  interface IRenderer {
    renderRule(rule: TRule, props: TRuleProps): void;
    renderKeyframe(keyFrame: TKeyFrame, props: TRuleProps): void;
    renderFont(family: string, files: Array<string>, props: TRuleProps): void;
    renderStatic(style: string, selector?: string): void;
    renderToString(): string;
    subscribe(event: (msg: TSubscribeRuleMessage | TSubscribeKeyframesMessage | TSubscribeFontFaceMessage | TSubscribeStaticStringMessage | TSubscribeClearMessage) => void): { unsubscribe: () => void; }
    clear();
  }

  //http://fela.js.org/docs/advanced/RendererConfiguration.html
  interface IConfig {
    plugins?: Array<TPlugin>;
    keyframePrefixes?: Array<string>;
    enhancers?: Array<TEnhancer>;
    mediaQueryOrder?: Array<string>;
    selectorPrefix?: string;
  }

  interface IStyle extends React.CSSProperties {
    //TODO: add properties, missing in React.CSSProperties
  }

  function createRenderer(config?: IConfig): IRenderer;
  function combineRules(...rules: Array<TRule>): TRule;
  function enhance(...enhancers: Array<TEnhancer>): (rendererCreator: TRendererCreator) => TRendererCreator;
}

declare module "fela-dom" {
  import { IRenderer } from 'fela';
  function render(renderer: IRenderer, node: HTMLElement);
}

