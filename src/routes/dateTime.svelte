<script lang="ts">
  import { type DateValue, DateFormatter, getLocalTimeZone } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button";

  import { CalendarIcon } from "lucide-svelte";

  import { cn } from "../lib/utils";
  import Calendar from "../components/ui/calendar/calendar.svelte";
  import * as Popover from "../components/ui/popover";
  import { createEventDispatcher } from "svelte";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let value: DateValue | undefined = undefined;
  const dispatch = createEventDispatcher();
  $: if (value !== undefined) {
    console.log(value);
    dispatch("change", { value });
  }
</script>

<Popover.Root openFocus>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="outline"
      class={cn("w-[280px] justify-start text-left font-normal", !value && "text-muted-foreground")}
      builders={[builder]}
    >
      <CalendarIcon class="mr-2 h-4 w-4" />
      {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value initialFocus />
  </Popover.Content>
</Popover.Root>
