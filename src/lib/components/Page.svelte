<script lang="ts">
	import checkAnyMovePossible from '$lib/scripts/checkAnyMovePossible';
	import checkLegalMove from '$lib/scripts/checkLegalMove';
	import checkWin from '$lib/scripts/checkWin';
	import getLegalMoves from '$lib/scripts/getLegalMoves';
	import resetGame from '$lib/scripts/resetGame';
	import saveGame from '$lib/scripts/saveGame';
	import sleep from '$lib/scripts/util/sleep';
	import type { Game } from '../../routes/+layout.server';

	const { game: g }: { game: Game } = $props();
	const game = $state(g);
	let showWin: boolean | null | 0 | 1 = $state(false);
	let movementHelp = $state(false);
	let lastUserCouldDoMove = true;
	let aiPlayer: null | 1 | 0 = $state(null);
	let enableAI = $state(false);
	let showAlert = $state(false);

	const claimSpot = (x: number, y: number) => {
		if (!checkAnyMovePossible(game) && !lastUserCouldDoMove) {
			showWin = null;
			return;
		}

		if (!checkAnyMovePossible(game)) {
			lastUserCouldDoMove = false;
			return;
		}

		lastUserCouldDoMove = true;

		const { success: isLegalMove, changingFields } = checkLegalMove(game, x, y);
		if (!isLegalMove) {
			showAlert = true;
			sleep(100).then(() => {
				showAlert = false;
			});
			return;
		}

		changingFields.forEach((f) => {
			game.fields[f.x][f.y] = game.now;
		});

		game.fields[x][y] = game.now;
		game.now = game.now === 0 ? 1 : 0;

		const win = checkWin(game);
		if (win !== false) {
			showWin = win;
			return;
		}

		saveGame(game);

		if (enableAI && game.now === aiPlayer) doAIMove();
	};

	const doAIMove = async () => {
		await sleep(1000);
		const possibleMoves = getLegalMoves(game);
		const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
		if (!move) {
			game.now = game.now === 0 ? 1 : 0;
			return;
		}

		claimSpot(move.x, move.y);
	};
</script>

<main class="fixed w-100vw h-100vh">
	<div class="ml-50% -translate-x-50% w-fit flex flex-col justify-center items-center gap-3">
		It is currently {game.now === 0 ? "Black's" : "White's"} turn

		<div class="flex flex-row justify-center items-center gap-2">
			<div class="bg-white rounded-full w-4 h-4 content-empty"></div>
			{game.fields.map((g) => g.filter((c) => c === 1).length).reduce((a, b) => a + b, 0)}
		</div>
		<div class="flex flex-row justify-center items-center gap-2">
			<div class="bg-black rounded-full w-4 h-4 content-empty"></div>
			{game.fields.map((g) => g.filter((c) => c === 0).length).reduce((a, b) => a + b, 0)}
		</div>

		{#if showWin === 1}
			👑 White player won!
		{:else if showWin === 0}
			👑 Black player won!
		{:else if showWin === null}
			Its a draw!
		{/if}

		<button
			class="btn-extra-danger-outlined"
			onclick={() => (game.now = game.now === 1 ? 0 : 1)}
			disabled={checkAnyMovePossible(game)}>Skip move</button
		>
	</div>

	<div class="bg-amber-6 w-fit h-fit m-auto mt-5 p-2">
		{#each game.fields as row, i}
			<div class="flex flex-row border-solid border-1px border-white">
				{#each row as cell, j}
					<div
						class="w-20 h-20 border-solid border-1px border-white {showAlert ? 'bg-red-9' : 'bg-green-8'} flex flex-row justify-center items-center m-auto relative"
					>
						<div class="absolute top-0 left-0 text-2">x{i}, y{j}</div>
						{#if cell === 0}
							<div class="content-empty bg-black rounded-full w-15 h-15"></div>
						{:else if cell === 1}
							<div class="content-empty bg-white rounded-full w-15 h-15"></div>
						{:else}
							<button
								class="content-empty rounded-full w-15 h-15 transition-all duration-100 ease-in-out
       {game.now === 0 ? 'hover:bg-black/50' : 'hover:bg-white/50'}
       {movementHelp && checkLegalMove(game, i, j).success ? 'bg-green/25' : ''}"
								aria-label="Take spot"
								onclick={() => claimSpot(i, j)}
								disabled={enableAI && game.now === aiPlayer}
							></button>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div
		class="fixed bottom-25 left-50% -translate-x-50% flex flex-row justify-center items-center gap-2"
	>
		<input
			type="checkbox"
			bind:checked={enableAI}
			name="ai"
			onclick={() => (aiPlayer = game.now === 1 ? 0 : 1)}
		/>
		<label for="ai"
			>Enemy AI ({enableAI
				? `${aiPlayer === 0 ? 'Black' : 'White'} is currently the AI player`
				: `${game.now === 0 ? 'White' : 'Black'} will become the AI player`})
		</label>
	</div>
	<div
		class="fixed bottom-20 left-50% -translate-x-50% flex flex-row justify-center items-center gap-2"
	>
		<input type="checkbox" class="" bind:checked={movementHelp} name="movementhelp" />
		<label for="movementhelp" class="">Movement help</label>
	</div>
	<button
		class="btn-extra-danger-outlined fixed bottom-10 left-50% -translate-x-50%"
		onclick={() => resetGame()}>Start new game</button
	>
</main>
