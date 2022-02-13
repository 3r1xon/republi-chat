import { animate, style, transition, trigger } from "@angular/animations";

export const fade = (timings) => {
    return trigger('fade', [
        transition('void => *', [
            style({
                opacity: 0
            }),
            animate(timings, style({
                opacity: 1
            }))
        ])
    ]);
};

export const openRight = (timings, margin) => {
    return trigger(
        'openRight',
        [
          transition(
            ':enter',
            [
              style({
                marginRight: margin
              }),
              animate(`${timings} ease-out`, style({
                marginRight: "*"
              }))
            ]
          ),
          transition(
            ':leave',
            [
              style({
                marginRight: "*"
              }),
              animate(`${timings} ease-in`, style({
                marginRight: margin
              }))
            ]
          )
        ]
    );
};

export const openLeft = (timings, margin) => {
    return trigger(
        'openLeft',
        [
          transition(
            ':enter',
            [
              style({
                marginLeft: margin
              }),
              animate(`${timings} ease-out`, style({
                marginLeft: "*"
              }))
            ]
          ),
          transition(
            ':leave',
            [
              style({
                marginLeft: "*"
              }),
              animate(`${timings} ease-in`, style({
                marginLeft: margin
              }))
            ]
          )
        ]
    );
};

export const expand = (timings) => {
  return trigger('expand', [
    transition('void => *', [
        style({
            height: 0,
        }),
        animate(timings, style({
            height: "*"
        }))
    ])
  ]);
}