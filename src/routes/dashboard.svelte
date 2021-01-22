<!--<script context="module" ✂prettier:content✂="CgkvLyBmb3IgcHJlZmV0Y2hpbmcgZGF0YQoJZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByZWxvYWQoKSB7CgkJbGV0IHJlcyA9IGF3YWl0IHRoaXMuZmV0Y2goImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC8iKTsKCQlsZXQgQUxMX0RhdGEgPSBhd2FpdCByZXMuanNvbigpOwoKCQlpZiAocmVzLm9rKSB7CgkJCXJldHVybiB7IEFMTF9EYXRhIH07CgkJfSBlbHNlIHsKCQkJdGhyb3cgbmV3IEVycm9yKCJTdHVmZidzIG5vdCB3b3JraW5nIHlvIik7CgkJfQoJfQo=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script>-->
<script>
	import Header from "../components/Header.svelte";
	import IconRegistered from "../components/dashboard/icons/Registered.svelte";
	import IconPassed from "../components/dashboard/icons/Passed.svelte";
	import IconFailed from "../components/dashboard/icons/Failed.svelte";
	import IconCurrent from "../components/dashboard/icons/Current.svelte";
	import { onMount } from "svelte";
	import { slide, fade } from "svelte/transition";
	import { loginDetails } from "../components/store.js";
	let ALL_Data = [[{}], [{}], [{}]];
	let id, password;

	onMount(() => {
		loginDetails.subscribe((value) => {
			id = value.id;
			password = value.password;
		});

		console.log({ id, password });

		async function preload() {
			if (id && password) {
				const res = await fetch(
					"https://461ce78c7b87.ngrok.io/fir-functions-tut-ea3e2/us-central1/getDashboardData",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id, password }),
					}
				);

				let ALL_Data = await res.json();
				if (res.ok) {
					return ALL_Data;
				} else {
					throw new Error("Stuff's not working yo");
				}
			}
		}
		ALL_Data = preload();
	});

	// list of icon components (for quicker icon rendering)
	let icons = [IconRegistered, IconPassed, IconFailed, IconCurrent];
</script>

<svelte:head>
	<title>My Dashboard</title>
</svelte:head>

<div class="main">
	<Header title="My Dashboard" {ALL_Data} />

	<!-- Main Content Wrapper -->
	<div class="content-grid">
		<!-- Quick statistics -->
		<section class="quick-stats bg">
			{#await ALL_Data}
				<h3 class="await">Please wait...</h3>
			{:then quickStats}
				<!-- destructured statData -->
				{#each quickStats[1] as { title, number }, i}
					<div
						class="stat"
						in:fade={{ duration: 1000 }}
						out:fade={{ duration: 250 }}
					>
						<!-- Icons -->
						<svelte:component this={icons[i]} />
						<!-- Icons -->

						<div class="stat__text-wrapper">
							<p class="stat__title">{title}</p>
							<span class="stat__value"> {number} </span>
						</div>
					</div>
				{/each}
			{:catch err}
				<h3>Please refresh Or Try Again Later</h3>
			{/await}
		</section>

		<!-- Cumulative grade point average -->
		<section class="cumul-pt-avg bg">
			{#await ALL_Data}
				<h3>Please wait...</h3>
			{:then cumlptavg}
				<h1>Cumulative Grade point Average</h1>
				<span>{cumlptavg[3]}</span>
			{:catch err}
				<h3>Please refresh Or Try Again Later</h3>
			{/await}
		</section>

		<!-- Student details -->
		<section class="stud bg">
			{#await ALL_Data}
				<h3>Please wait...</h3>
			{:then studDetails}
				<!-- destructured studData -->
				{#each studDetails[2] as { title, detail }}
					<div
						class="stud-detail"
						in:slide={{ duration: 1000 }}
						out:fade={{ duration: 250 }}
					>
						<h4 class="stud-detail__title">{title}</h4>
						<h2 class="stud-detail__value">{detail}</h2>
					</div>
				{/each}
			{:catch err}
				<h3>Please refresh Or Try Again Later</h3>
			{/await}
		</section>

		<!-- Student performance graph -->
		<section class="stud-performance bg">
			<div class="stud-performance__title">
				<h1>Student Performance Graph</h1>
				<h4>Max Performance 4</h4>
			</div>
		</section>
	</div>
</div>

<style lang="scss">
	.main {
		height: 100%;
		width: 100%;
		position: relative;
		background: inherit;
		padding: 0 50px 50px;
		overflow-y: auto;
	}

	.content-grid {
		margin-top: 5px;
		display: grid;
		grid-template-columns: 1.5fr 0.7fr;
		grid-template-rows: 0.5fr 0.25fr 1.5fr;
		grid-template-areas:
			"head head"
			"cuml details"
			"perf details";
		grid-gap: 30px;
	}

	.bg {
		background: #ffffff;
		box-shadow: var(--box-shadow);
		border-radius: var(--advanced-radius);
	}

	.quick-stats {
		width: 100%;
		padding: 40px 30px;
		display: flex;
		justify-content: space-evenly;
		grid-area: head;
	}

	.stat {
		display: flex;
		align-items: center;
		justify-content: space-evenly;

		&:not(:last-child) {
			margin-right: 20px;
			border-right: 2px solid #f8fafc;
			padding-right: 20px;
		}

		&__title {
			font-size: var(--font-size-smaller);
			font-weight: var(--semibold);
		}

		&__value {
			font-size: calc(var(--font-size-mid) + 1px);
			font-weight: var(--extrabold);
		}
	}

	.cumul-pt-avg {
		grid-area: cuml;
		text-align: center;
		padding: 16px;

		h1 {
			font-size: var(--font-size-mid);
			font-weight: var(--semibold);
		}

		span {
			font-size: var(--font-size-big);
			font-weight: var(--extrabold);
		}
	}

	.stud {
		grid-area: details;
		padding: 30px;

		&-detail {
			border-bottom: 1px solid rgba(83, 89, 104, 0.2);

			&:not(:last-child) {
				margin-bottom: 20px;
			}

			&__title {
				font-size: var(--font-size-smallest);
				font-weight: var(--semibold);
			}

			&__value {
				font-size: var(--font-size-small);
				font-weight: var(--bold);
			}
		}
	}

	.stud-performance {
		grid-area: perf;
		padding: 0;

		&__title {
			width: 100%;
			padding: 20px 20px 10px;
			text-align: center;
			border-bottom: 1px solid rgba(83, 89, 104, 0.3);

			h1 {
				font-size: var(--font-size-mid);
				font-weight: var(--semibold);
			}

			h4 {
				font-size: var(--font-size-smaller);
				font-weight: var(--regular);
			}
		}
	}

	@media screen and (max-width: 1280px) {
		.main {
			padding: 0 0 30px;
		}

		.content-grid {
			grid-template-columns: 1.3fr 0.8fr;
			margin: 10px 30px 30px;
		}

		.stat {
			&:not(:last-child) {
				margin-right: 15px;
				border-right: 2px solid #f8fafc;
				padding-right: 15px;
			}
		}
	}

	@media screen and (max-width: 728px) {
		.content-grid {
			display: block;

			> section {
				margin-bottom: 30px;
			}
		}

		.await {
			background: #ffffff;
			box-shadow: var(--box-shadow);
			border-radius: var(--advanced-radius);
			padding: 20px;
		}

		.quick-stats {
			flex-direction: column;
			background: none;
			box-shadow: none;
			padding: 0;
		}

		.stat {
			justify-content: initial;
			padding: 20px 30px;
			background: #ffffff;
			box-shadow: var(--box-shadow);
			border-radius: var(--advanced-radius);

			&:not(:last-child) {
				border-right: none;
				margin-right: 0;
				margin-bottom: 20px;
			}
			&__title {
				font-size: var(--font-size-small);
			}
			&__value {
				font-size: calc(var(--font-size-mid) + 2px);
			}
		}

		.stud-performance {
			height: 300px;
		}

		.stud-detail {
			&__title {
				font-size: calc(var(--font-size-smaller) + 1px);
			}
			&__value {
				font-size: var(--font-size-mid);
			}
		}
	}
</style>
