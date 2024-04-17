<script>
  import { createEventDispatcher } from "svelte";
  export let value = 0;
  let quantity = 0;

  function increment() {
    dispatch("change", quantity);
    quantity++;
  }

  function decrement() {
    if (quantity > 0) {
      dispatch("change", quantity);
      quantity--;
    }
  }
  const dispatch = createEventDispatcher();
  function onChange(event) {
    quantity = event.target.value;
    dispatch("change", quantity);
  }
</script>

<form class="max-w-xs mx-auto">
  <label for="quantity-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >min nurses per shift:</label
  >
  <div class="relative flex items-center max-w-[8rem] h-5px -mt-3">
    <!-- SVG for decrement button -->
    <input
      bind:value
      on:input={onChange}
      type="number"
      id="quantity-input"
      class="bg-gray-50 border-x-0 border-gray-300 h-2 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="999"
      required
    />
    <!-- SVG for increment button -->
  </div>
</form>
