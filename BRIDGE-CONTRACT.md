# Bridge API: Host

API для обміну між `host-app` і OHIF Viewer через `window.postMessage`.

## Protocol

```ts
type BridgeMessage<TType extends string, TPayload> = {
  version: 1;
  type: TType;
  payload: TPayload;
};

type ViewerToolName = 'EllipticalROI' | 'Length';

type Metric = {
  value: number;
  unit: string;
};
```

## Host -> Viewer

| Type                   | Payload                                       |
| ---------------------- | --------------------------------------------- |
| `REQUEST_VIEWER_READY` | `{}`                                          |
| `ACTIVATE_TOOL`        | `{ rowId: string, toolName: ViewerToolName }` |
| `DEACTIVATE_TOOL`      | `{ rowId: string }`                           |
| `FOCUS_MEASUREMENT`    | `{ annotationId: string }`                    |
| `DELETE_MEASUREMENT`   | `{ annotationId: string }`                    |

## Viewer -> Host

| Type                  | Payload                                   |
| --------------------- | ----------------------------------------- |
| `VIEWER_READY`        | `{}`                                      |
| `MEASUREMENT_ADDED`   | `MeasurementPayload`                      |
| `MEASUREMENT_UPDATED` | `MeasurementPayload`                      |
| `MEASUREMENT_REMOVED` | `{ rowId: string, annotationId: string }` |

```ts
type MeasurementPayload = {
  rowId: string;
  annotationId: string;
  toolName: ViewerToolName;
  metric: Metric;
};
```
