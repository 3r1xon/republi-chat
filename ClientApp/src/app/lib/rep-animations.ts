import { animate, state, style, transition, trigger } from "@angular/animations";

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



export const openLeftNoDestroy = (width, timings) => {
  return trigger('openLeftNoDestroy', [
    state('true', style({
      marginLeft: '*',
    })),
    state('false', style({
      marginLeft: `-${width}`,
    })),
    transition('true <=> false', animate(timings)),
  ]);
};



export const openRightNoDestroy = (width, timings) => {
  return trigger('openRightNoDestroy', [
    state('true', style({
      marginRight: '*',
    })),
    state('false', style({
      marginRight: `-${width}`,
    })),
    transition('true <=> false', animate(timings)),
  ]);
};



export const expand = (timings) => {
  return trigger('expand', [
    state('initial', style({
      height: '0',
      overflow: 'hidden',
      opacity: '0',
      visibility: 'hidden'
    })),
    state('final', style({
      overflow: 'hidden'
    })),
    transition('initial <=> final', animate(timings))
  ]);
};

// export const expand = (timings) => {
//   return trigger('expand', [
//     transition(
//       ':enter',
//       [
//         style({
//           height: '0',
//           overflow: 'hidden',
//           opacity: '1',
//         }),
//         animate(`${timings} ease-in`, style({ }))
//       ]
//     ),
//     transition(
//       ':leave',
//       [
//         animate(`${timings} ease-out`, style({
//           height: '0',
//           opacity: '0',
//         }))
//       ],
//     )
//   ]);
// }
