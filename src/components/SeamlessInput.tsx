import { Component, JSX, createMemo, createSignal, splitProps } from "solid-js";

export type Props = {
  value: string;
  prefix?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

const SeamlessInput: Component<Props> = (props) => {
  const [split, rest] = splitProps(props, ["value"]);

  const [editing, setEditing] = createSignal(false);

  const padding = createMemo(() =>
    props.prefix ? "py-2 pl-6 pr-3" : "py-2 px-3"
  );

  return (
    <div class="relative">
      <input
        class={`bg-zinc-700 py-2 ${padding()}`}
        classList={{
          "text-transparent": !editing(),
        }}
        onBlur={(e) => {
          setEditing(false);
        }}
        onFocus={(e) => {
          setEditing(true);
        }}
        value={props.value}
      />
      {props.prefix && (
        <p class="absolute left-0 top-0 bottom-0 pl-3 py-2 text-yellow-300">{props.prefix}</p>
      )}
      {!editing() && (
        <p class={`absolute inset-0 pointer-events-none ${padding()}`}>
          {props.value}
        </p>
      )}
    </div>
  );
};

export default SeamlessInput;
