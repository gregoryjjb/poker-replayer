import { Accessor, Component, createMemo, createSignal } from "solid-js";
import solidLogo from "./assets/solid.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Game, Player } from "./game";
import { createStore, produce } from "solid-js/store";
import SeamlessInput from "./components/SeamlessInput";

interface TableState {
  players: Player[];
  buttonPosition: number;
}

const createTableState = () => {
  const [state, setState] = createStore<TableState>({
    players: [
      {
        name: "Andy",
        holeCards: null,
        reads: "anything",
        stackSize: 420,
      },
      {
        name: "Betty",
        holeCards: null,
        reads: "anything",
        stackSize: 420,
      },
      {
        name: "Carl",
        holeCards: null,
        reads: "anything",
        stackSize: 420,
      },
      {
        name: "Dick",
        holeCards: null,
        reads: "anything",
        stackSize: 420,
      },
      {
        name: "Evan",
        holeCards: null,
        reads: "anything",
        stackSize: 420,
      },
      {
        name: "John Jacob Jingleheimer Shmidt",
        holeCards: null,
        reads: "anything",
        stackSize: 420,
      },
    ],
    buttonPosition: 0,
  });

  const deletePlayer = (index: number) => {
    setState(
      produce((state) => {
        state.players.splice(index, 1);

        if (state.buttonPosition >= index) {
          state.buttonPosition--;
        }
      })
    );
  };

  const updateName = (index: number, name: string) => {
    setState("players", index, "name", name);
  };

  return {
    state,
    setState,
    deletePlayer,
    updateName,
    get players() {
      return state.players;
    },
  };
};

function App() {
  const [count, setCount] = createSignal(0);

  const game = new Game({
    playerCount: 6,
    bigBlind: 10,
    smallBlind: 5,
    ante: 0,
  });

  const tableState = createTableState();

  const [name, setName] = createSignal(
    `Villian ${tableState.players.length + 1}`
  );

  const [size, setSize] = createSignal(0);
  const radius = createMemo(() => (size() / 2) * 0.8);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return (
    <div class="mx-auto max-w-5xl">
      <div class="max-w-sm bg-zinc-800 px-4 py-3 mx-auto mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (tableState.players.length >= 9) return;

            tableState.setState(
              produce((state) => {
                state.players.push({
                  name: name(),
                  holeCards: 0,
                  reads: "",
                  stackSize: 0,
                });
              })
            );

            setName(`Villian ${tableState.players.length + 1}`);
          }}
          class="flex flex-row items-end gap-3"
        >
          <div class="flex flex-col flex-1">
            <label
              for="new-player-name"
              class="text-sm mb-1 font-semibold text-slate-200"
            >
              Name
            </label>
            <input
              type="text"
              id="new-player-name"
              value={name()}
              onChange={(e) => setName(e.target.value)}
              class="bg-zinc-700 w-full"
            />
          </div>
          <button
            type="submit"
            class="bg-green-900 text-green-50 font-semibold text-sm rounded px-2 py-1 disabled:bg-zinc-700 disabled:text-zinc-600"
            disabled={tableState.players.length >= 9}
          >
            Add player
          </button>
        </form>
      </div>

      <div class="w-full relative">
        <div class="pb-[100%]" />
        <div class="absolute inset-0">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-emerald-800 border-8 border-amber-950 rounded-full w-1/2 h-1/2 drop-shadow-lg" />
          </div>
          <ul
            ref={(el) => {
              new ResizeObserver((args) => {
                const cr = args[0].contentRect;
                setSize(cr.width);
              }).observe(el);
            }}
            class="relative w-full h-full"
          >
            {tableState.state.players.map((player, i) => (
              <li
                class="absolute text-white flex items-center justify-center"
                style={{
                  top:
                    size() / 2 -
                    Math.sin(
                      ((Math.PI * 2) / tableState.state.players.length) * i -
                        Math.PI / 2
                    ) *
                      radius() +
                    "px",
                  left:
                    size() / 2 -
                    Math.cos(
                      ((Math.PI * 2) / tableState.state.players.length) * i -
                        Math.PI / 2
                    ) *
                      radius() +
                    "px",
                  // left: size / 2 - radius + "px",
                  // width: playerWidth + "px",
                  // height: playerHeight + "px",
                  width: "0px",
                  height: "0px",
                }}
              >
                <div class="flex flex-col items-center bg-zinc-800 rounded-lg p-2 drop-shadow-xl">
                  <input
                    class="text-lg text-center font-semibold  bg-transparent focus:outline-none border border-transparent focus:border-blue-400 w-48 rounded"
                    // style={{ width: playerWidth + "px" }}
                    value={player.name}
                    onChange={(e) => tableState.updateName(i, e.target.value)}
                  />
                  <input
                    class="text-yellow-300 mb-3 text-center bg-transparent w-20 focus:outline-none border border-transparent focus:border-blue-400 rounded"
                    value={formatter.format(player.stackSize)}
                    onFocus={(e) => {
                      e.target.value = player.stackSize.toString();
                    }}
                    onChange={(e) => {
                      const n = parseFloat(e.target.value);
                      tableState.setState("players", i, "stackSize", n);
                      e.target.value = formatter.format(player.stackSize);
                    }}
                    onBlur={(e) => {
                      e.target.value = formatter.format(player.stackSize);
                    }}
                  />
                  <div class="flex flex-row gap-2 mb-3">
                    <PlayingCard />
                    <PlayingCard />
                  </div>
                  <div class="flex flex-row justify-between w-full">
                    {i === tableState.state.buttonPosition ? (
                      <div class="w-7 h-7 bg-yellow-400 flex items-center justify-center rounded-full">
                        <p class="text-black font-semibold">B</p>
                      </div>
                    ) : (
                      <button
                        class="h-7 text-sm text-yellow-700 font-semibold px-2 rounded italic bg-transparent hover:bg-yellow-950"
                        onClick={() => tableState.setState("buttonPosition", i)}
                      >
                        Place{" "}
                        <span class="bg-yellow-600 text-black rounded-full text-xs w-4 h-4 inline-block">
                          B
                        </span>
                      </button>
                    )}
                    <button class="text-sm font-semibold px-2 h-7 rounded text-zinc-400 hover:bg-red-950 hover:text-red-600" onClick={() => tableState.deletePlayer(i)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <pre>{JSON.stringify(tableState.state.players, undefined, 2)}</pre>
    </div>
  );
}

const PlayingCard: Component = () => {
  return (
    <div class="w-8 h-12 border-2 border-white rounded bg-sky-800 flex items-center justify-center text-lg">
      ?
    </div>
  );
};

interface ElementSize {
  width: number;
  height: number;
}

export default App;

export const createElementSize = <T extends HTMLElement>(): [
  Accessor<ElementSize>,
  (element: T) => void
] => {
  const [box, setBox] = createSignal<ElementSize>({ width: 0, height: 0 });
  return [
    box,
    (element: T) => {
      if (true) {
        new ResizeObserver((args) => {
          const cr = args[0].contentRect;
          setBox({ width: cr.width, height: cr.height });
        }).observe(element);
      }
    },
  ];
};
