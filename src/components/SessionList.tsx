import { createEffect, createSignal, For, onCleanup, onMount } from "solid-js"
import type { SessionItem } from "./Generator"
import { makeEventListener } from "@solid-primitives/event-listener"

export default function SessionList(props: {
  sessions: SessionItem[]
  select: (id: int) => void
}) {
  let containerRef: HTMLUListElement
  const [hoverIndex, setHoverIndex] = createSignal(0)
  const [maxHeight, setMaxHeight] = createSignal("320px")

  createEffect(() => {
    if (hoverIndex() < 0) {
      setHoverIndex(0)
    } else if (hoverIndex() && hoverIndex() >= props.sessions.length) {
      setHoverIndex(props.sessions.length - 1)
    }
  })

  createEffect(() => {
    if (containerRef && props.sessions.length)
      setMaxHeight(
        `${
          window.innerHeight - containerRef.clientHeight > 112
            ? 320
            : window.innerHeight - 112
        }px`
      )
  })

  onMount(() => {
    makeEventListener(
      window,
      "keydown",
      e => {
        if (e.key === "ArrowDown") {
          setHoverIndex(hoverIndex() + 1)
        } else if (e.key === "ArrowUp") {
          setHoverIndex(hoverIndex() - 1)
        } else if (e.key === "Enter") {
          props.select(props.sessions[hoverIndex()].id)
        }
      },
      { passive: true }
    )
  })

  return (
    <ul
      ref={containerRef!}
      class="bg-slate bg-op-15 dark:text-slate text-slate-7 overflow-y-auto"
      style={{
        "max-height": maxHeight(),
        "color": "#ffffff"
      }}
    >
      <For each={props.sessions}>
        {(session, i) => (
          <Item
            session={session}
            select={props.select}
            hover={hoverIndex() === i()}
          />
        )}
      </For>
    </ul>
  )
}

function Item(props: {
  session: SessionItem
  select: (id: int) => void
  hover: boolean
}) {
  let ref: HTMLLIElement
  createEffect(() => {
    if (props.hover) {
      ref.focus()
      ref.scrollIntoView({ block: "center" })
    }
  })
  return (
    <li
      ref={ref!}
      class="hover:bg-slate hover:bg-op-20 py-1 px-3"
      classList={{
        "bg-slate": props.hover,
        "bg-op-20": props.hover
      }}
      onClick={() => {
        props.select(props.session.id)
      }}
    >
      <p>{props.session.desc}</p>
      <p class="text-0.4em">{props.session.detail}</p>
    </li>
  )
}
