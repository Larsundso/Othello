<script lang="ts">
	import { type Game } from './+layout.server';
	import Page from '$lib/components/Page.svelte';
	import '$lib/scripts/index.js';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import resetGame from '$lib/scripts/resetGame';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();
	let hide = $state(false);

	const hideModal = () => {
		hide = true;
	};
</script>

<div
	id="main"
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins overflow-auto h-100vh"
>
	{#if data.restored && !hide}
		<div class="w-100vw h-100vh bg-black/80 fixed z-99999">
			<div
				class="absolute left-50% top-50% -translate-x-50% -translate-y-50% flex flex-col justify-center items-center"
			>
				<h2 class="text-2xl">You have a game in progress!</h2>

				<div class="flex flex-row gap-2 mt-2">
					<button class="btn-success" onclick={() => hideModal()}>Continue</button>
					<button class="btn-extra-danger-outlined" onclick={() => resetGame()}>Start new game</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="bg-main w-full h-full">
		<Page game={data} />
	</div>
</div>

<div class="hidden">
	{@render children()}
</div>
