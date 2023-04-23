<script lang="ts">
    import json from './chords.json'
    import Tailwind from "./Tailwind.svelte"
    import { onMount } from 'svelte';

    const octaves = 3;

    let keys = [...Array(12 * octaves + 1)].map((_, i) => i)

    let scales = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]

    let cbase_i: number, ctype_i: number

    interface Histry {
        chord: string
        tf: boolean
    }

    let hist: Histry[] = new Array()

    let chord = ""
    let component = []
    let tf = ""
    let result = 0

    let game = false

    let selected: boolean[] = new Array(12 * octaves + 1)

    let finish_dialog

    onMount(() => {
        finish_dialog = <HTMLDialogElement> document.getElementById("finish")
    })

    function start() {
        game = true
        newquestion()
    }
    
    function newquestion() {
        cbase_i = Math.floor(Math.random() * 12)
        ctype_i = Math.floor(Math.random() * (json.chords.length + 1))
        chord = scales[cbase_i] + json.chords[ctype_i].name
        component = json.chords[ctype_i].component.map((c) => (c + cbase_i) % 12)
        tf = ""

        for (let key_elem of document.querySelectorAll(".keyboard")) {
            key_elem.removeAttribute("disabled")
        }
    }

    function onclick(keynum: number) {
        selected[keynum] = selected[keynum] ? false : true
        if (selected[keynum]) {
            document.querySelector("#key" + keynum + " span").setAttribute("id", "selected")
        } else {
            document.querySelector("#key" + keynum + " span").removeAttribute("id")
        }
    }

    function lock() {
        let tof = true

        let s_scales: boolean[] = Array(12).fill(false)
        for (let selec in selected) {
            if (!s_scales[Number(selec) % 12] && selected[selec]) {
                s_scales[Number(selec) % 12] = true
            }
        }

        for (let s_scale in s_scales) {
            if (s_scales[s_scale] && !component.includes(Number(s_scale))) {
                tof = false
                break
            }
            if (!s_scales[s_scale] && component.includes(Number(s_scale))) {
                tof = false
                break
            }
        }

        
        if (tof) {
            tf = '<span class="text-blue-600">circle</span>'
        } else {
            tf = '<span class="text-red-600">close</span>'
        }

        selected.fill(false)
        for (let key_elem of document.querySelectorAll(".keyboard span")) {
            key_elem.removeAttribute("id")
        }

        button_disabled()

        hist.push({chord: chord, tf: tof})
    }

    function finish() {
        game = false
        tf = ""
        chord = ""
        component = []
        for (let hist_i of hist) {
            if (hist_i.tf) {
                result++
            }
        }
        button_disabled()
        finish_dialog.showModal()

        finish_dialog.addEventListener('close', () => {
            hist.splice(0)
            result = 0
        })
    }

    function button_disabled() {
        for (let key_elem of document.querySelectorAll(".keyboard")) {
            key_elem.setAttribute("disabled", "")
        }
    }
</script>

<style>
    @import url("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined");
    @tailwind utilities;
    @tailwind components;
    @tailwind base;

    .material-icons-outlined {
        font-size: unset;
        line-height: unset;
        @apply inline-flex;
    }

    .whitekey:has(#selected) {
        @apply bg-[#bff2fa];
    }

    .blackkey:has(#selected) {
        @apply bg-[#093c44];
    }
</style>

<Tailwind />

<dialog id="finish" class="backdrop:bg-zinc-950/25 bg-white p-4 min-w-[60%] z-30">
    <h3 class="font-medium text-5xl">{result}<span class="text-2xl">/5</span></h3>
    <p>
        {#if result <= 2}
            Keep trying.
        {:else if result <= 4}
            Good.
        {:else}
            Perfect!!
        {/if}
    </p>
    <p class="mt-8"><button class="cursor-pointer text-lg px-1 border border-zinc-400" on:click={() => finish_dialog.close()}>Close</button></p>
</dialog>

<div>
    <p class="text-2xl my-1">
        {#if chord == ""}
            Not Started
        {:else}
            Chord: {chord}
        {/if}
    </p>
    <div class="flex divide-x divide-zinc-400 border border-zinc-400 w-fit h-fit mx-auto" id="keyboard">
        {#each keys as key}
            <button
                id="key{key}"
                class="keyboard block {[1, 4, 6, 9, 11].includes(key % 12) ? 'blackkey w-6 h-24 -ml-3 bg-black z-20' : 'whitekey w-8 h-40 bg-white z-10'} {[2, 5, 7, 10].includes((key % 12)) || (key != 0 && key % 12 == 0) ? '-ml-3' : ''}"
                on:click={() => onclick(key)}
                disabled
            >
                <span></span>
            </button>
        {/each}
    </div>
    <p class="mt-2">
        {#if !game}
            <button class="cursor-pointer text-lg px-1 border border-zinc-400" on:click={start}>New Game</button>
        {:else if hist.length == 5}
            <button class="cursor-pointer text-lg px-1 border border-zinc-400" on:click={finish}>Finish</button>
        {:else if tf == ""}
            <button class="cursor-pointer text-lg px-1 border border-zinc-400" on:click={lock}>Lock</button>
        {:else}
            <button class="cursor-pointer text-lg px-1 border border-zinc-400" on:click={newquestion}>Next &gt;</button>
        {/if}
    </p>
    <p class="mt-2 text-5xl">
        <span class="material-icons-outlined">
            {@html tf}
        </span>
    </p>
</div>