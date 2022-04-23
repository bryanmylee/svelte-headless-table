<script lang="ts">
</script>

<h1>svelte-tables</h1>

<table>
	<thead>
		<!-- {#each $table.headerRows as headerRow} -->
		<tr>
			<!-- {#each headerRow.cells as cell} -->
			<th>
				<!-- <Render {...cell.render()} /> -->
			</th>
			<!-- {/each} -->
		</tr>
		<!-- {/each} -->
	</thead>
	<tbody>
		<!-- {#each $table.dataRows as dataRow} -->
		<tr>
			<!-- {#each dataRow.cells as cell} -->
			<td>
				<!-- <Render {...cell.render()} /> -->
			</td>
			<!-- {/each} -->
		</tr>
		<!-- {/each} -->
	</tbody>
	<tfoot>
		<!-- {#each $table.footerRows as footerRow} -->
		<tr>
			<!-- {#each footerRow.cells as cell} -->
			<td>
				<!-- <Render {...cell.render()} /> -->
			</td>
			<!-- {/each} -->
		</tr>
		<!-- {/each} -->
	</tfoot>
</table>

<style global>
	* {
		font-family: sans-serif;
	}

	table {
		border-spacing: 0;
		border-top: 1px solid black;
		border-left: 1px solid black;
	}

	th,
	td {
		margin: 0;
		padding: 0.5rem;
		border-bottom: 1px solid black;
		border-right: 1px solid black;
	}
</style>
