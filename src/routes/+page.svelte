<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table/index.js";
  import { writable } from "svelte/store"; // Import the writable store
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import dayjs from "dayjs";
  import DialogPortal from "$lib/components/ui/dialog/dialog-portal.svelte";
  import { mdiGenderFemale } from "@mdi/js";
  import X from "lucide-svelte/icons/x";
  import Check from "lucide-svelte/icons/check";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import RadioGroupItem from "$lib/components/ui/radio-group/radio-group-item.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { onMount } from "svelte";
  import DateTime from "./dateTime.svelte";
  import Numberinput from "./numberinput.svelte";
  import { LogIn } from "lucide-svelte";
  import * as HoverCard from "../components/ui/hover-card";
  import { read, utils, write } from "xlsx";

  // Use a writable store for Users
  let open = false;
  let perShift: number = 3;
  let name = "";
  let email = "";
  let phone = "";
  let gender = "male";
  let failure = "";
  let fileInput: HTMLInputElement;

  type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    offDays: Record<number, boolean>;
    score: number;
    days: number;
    nights: number;
    shifts: [string];
  };
  type Shift = User[];
  let users = writable<User[]>([]);
  let currentMonth: any = dayjs();
  let month: number;
  let daysInMonth: any[];
  let holiday: Record<number, boolean> = writable({});
  let maxDaysOvertime = 0;

  onMount(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      console.log(storedUsers, "storedUsers");
      users.set(JSON.parse(storedUsers));
    }
    const storedpershift = localStorage.getItem("pershift");
    if (storedpershift) {
      perShift = JSON.parse(storedpershift);
    }
    $users.sort((a, b) => {
      // Sort by gender first
      if (a.gender < b.gender) return -1;
      if (a.gender > b.gender) return 1;

      // If gender is the same, sort by name
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;

      return 0; // names are equal
    });
    currentMonth = dayjs();
    month = currentMonth.daysInMonth();
    daysInMonth = Array.from({ length: month }, (_, i) => dayjs().date(i));
  });

  $: if (currentMonth) {
    month = currentMonth.daysInMonth();
    fetchHolidays();
  }
  $: if (holiday) {
    maxDaysOvertime = 0;
    daysInMonth.forEach((day) => {
      const isWeekend = day.day() === 0 || day.day() === 6 || holiday[day.date()];
      maxDaysOvertime = isWeekend ? maxDaysOvertime + 1 : maxDaysOvertime;
    });
    const lastDateOfMonth = currentMonth.endOf("month").date();
    maxDaysOvertime = lastDateOfMonth - maxDaysOvertime;
  }
  async function fetchHolidays() {
    holiday = {};
    const lastDateOfMonth = currentMonth.endOf("month").date();
    fetch(
      `https://openholidaysapi.org/PublicHolidays?countryIsoCode=HR&languageIsoCode=HR&validFrom=${currentMonth["$y"]}-${currentMonth["$M"] + 1}-01&validTo=${currentMonth["$y"]}-${currentMonth["$M"] + 1}-${lastDateOfMonth}`
    )
      .then((response) => response.json())
      .then((data) => {
        data.forEach((holidayy: any) => {
          holiday[Number(holidayy.startDate.slice(-2))] = true;
        });
      });
    console.log(holiday, currentMonth, "holiday");
  }
  $: if (month) {
    daysInMonth = Array.from({ length: month }, (_, i) => currentMonth.date(i + 1));
  }
  let possible = writable(false);

  function handleChange(user: any, day: any, e: any) {
    users.update((users) => {
      const userIndex = users.findIndex((u) => u.id === user.id);
      const updatedUser = { ...users[userIndex] }; // Clone the user
      updatedUser.offDays[day.date() - 1] = !updatedUser.offDays[day.date() - 1]; // Update the offDays array
      users[userIndex] = updatedUser; // Replace the user in the users array
      return [...users]; // Return a new array
    });
  }

  function isValidShift(user: User, day: number, shift: Shift, time: String): User | null {
    // Check if the user has an off day
    if ((user && user.offDays[Number(day) - 1]) || (user.shifts.length === day + 1 && time === "n")) {
      return null;
    }

    // Check if there is at least one male in the shift
    if (
      shift.length === perShift - 1 &&
      shift.every((person) => person.gender === "female") &&
      user.gender !== "female"
    ) {
      return null;
    }
    if (user.shifts[day] != "-" || user.shifts[day] == "d") {
      return null;
    }

    const sequences = ["-nd", "nnd", "-nn", "nnn", "ddd", "ddn", "dnn"];
    const seqn = ["nn", "nd"];
    const seqd = ["dd", "nn", "dn", "-n"];

    // Check if the user has less than 4 shifts in a row

    if (day >= 2) {
      const lastTwoShifts = user.shifts.slice(day - 2, day).join("");
      const lastThreeShifts = user.shifts.slice(day - 3, day).join("");

      if (
        sequences.includes(lastThreeShifts) ||
        (seqn.includes(lastTwoShifts) && time === "n") ||
        (seqd.includes(lastTwoShifts) && time === "d")
      ) {
        return null;
      }
    }
    return user;
  }
  function getPrevShift(day: string, users: User[], date: number): User[] {
    const a = users.filter((user) => {
      if (user.shifts[date - 1] == day) {
        return user;
      }
    });
    return a;
  }

  function generateSched(): void {
    let looper: number[] = Array(daysInMonth.length + 2).fill(0);
    let usericii: User[] = JSON.parse(JSON.stringify($users));
    type UserShiftPair = [user: User, shift: any]; // Replace 'any' with the actual types of user and shift
    let goBackArray: UserShiftPair[][] = Array.from({ length: daysInMonth.length + 1 }, () => []);
    let i = usericii.length; // Assuming 'i' is the index for the new user
    usericii.forEach((user) => {
      user.shifts = new Array(daysInMonth.length + 2).fill("-");
      user.score = 0;
      user.days = 0;
      user.nights = 0;
    });
    const schedule: Record<number, string>[] = [];
    var prepareshift = usericii.reduce((acc: { [key: number]: number[] }, user) => {
      acc[user.id] = Array(daysInMonth.length + 1).fill(0.0);
      return acc;
    }, {});
    let shiftd: Shift = [];
    let shiftn: Shift = [];
    for (let user of usericii) {
      for (let key in user.offDays) {
        console.log(user.offDays[key], key, "key");
        if (user.offDays && typeof user.offDays === "object")
          if (user.offDays[Number(key)] == true) {
            console.log("asjdawjawidjai");
            let i = 1;
            while (Number(key) - i > 0 && i < 5) {
              if (user.offDays[Number(key) - i] == true) {
                break;
              }
              const userr = usericii[i];
              if (i > 2) {
                prepareshift[user.id][Number(key) + 1 - i] +=
                  Number(prepareshift[user.id][Number(key) + 1 - i]) + (2 / i) * 4;
                i++;
                continue;
              }

              prepareshift[user.id][Number(key) + 1 - i] +=
                Number(prepareshift[user.id][Number(key) + 1 - i]) - (2 / i) * 2;
              i++;
            }
          }
      }
    }
    console.log(prepareshift, usericii, "prepareshift");

    for (let index = 0; index < daysInMonth.length; index++) {
      const dayjsObject = daysInMonth[index];

      const day = index + 1;
      if (looper[day] >= 600) {
        $possible = true;
        return;
      }
      // Get the day of the month
      let usersTemp = usericii;

      usericii.forEach((user) => {
        let shiftScore = prepareshift[user.id][day];
        user.score += shiftScore;
        user.shifts[day] = "-";
      });
      usericii.sort((a, b) => {
        return a.score - b.score || a.days - b.days;
      });
      // Assign shifts to 3 users each day
      let i = 0;
      shiftd = [];
      failure = "";
      while (shiftd.length < perShift && i < usericii.length) {
        const userr = usericii[i];
        if (
          goBackArray[day][goBackArray[day].length - 1] &&
          goBackArray[day][goBackArray[day].length - 1][0] === userr &&
          goBackArray[day][goBackArray[day].length - 1][1] === "d"
        ) {
          i += goBackArray[day].length;
          continue;
        }

        const shit = isValidShift(userr, day, shiftd, "d");

        if (shit != null) {
          shiftd.push(shit);
          usersTemp[i].score++;
          usersTemp[i].days++;
        }
        i++;
      }
      if ((shiftd.length < perShift - 1 && day > 3) || goBackArray[day].length == usericii.length / 2 + 1) {
        const randomNum = Math.floor(Math.random() * 3);
        const prevshift = getPrevShift("d", usericii, day);
        const targetArray = [prevshift[randomNum], "d"];

        if (
          !goBackArray[day - 1].some(
            (arr) => arr.length === targetArray.length && arr.every((value, index) => value === targetArray[index])
          )
        ) {
          goBackArray[day - 1].push([prevshift[randomNum], "d"]); // Replace "d" with the actual shift
        }

        goBackArray[day] = [];
        index -= 2;
        usericii = usersTemp;
        looper[day] = looper[day] + 1;
        continue;
      }
      shiftd.forEach((User) => {
        for (let user of usericii) {
          if (User == user) user.shifts[day] = "d";
        }
      });
      shiftn = [];
      usericii.sort((a, b) => {
        return a.score - b.score || a.nights - b.nights;
      });
      i = 0;

      while (shiftn.length < perShift && i < usericii.length) {
        const userr = usericii[i];
        if (
          goBackArray[day][goBackArray[day].length - 1] &&
          goBackArray[day][goBackArray[day].length - 1][0] === userr &&
          goBackArray[day][goBackArray[day].length - 1][1] === "n"
        ) {
          i += goBackArray[day].length;
          continue;
        }
        const shit = isValidShift(userr, day, shiftn, "n");
        if (shit != null) {
          shiftn.push(shit);
          usersTemp[i].score++;
          usersTemp[i].nights++;
        }

        i++;
      }
      if (shiftn.length < perShift && day > 3) {
        const randomNum = Math.floor(Math.random() * perShift);
        const prevshift = getPrevShift("d", usericii, day);
        const targetArray = [prevshift[randomNum], "n"];

        if (
          !goBackArray[day - 1].some(
            (arr) => arr.length === targetArray.length && arr.every((value, index) => value === targetArray[index])
          )
        ) {
          goBackArray[day - 1].push([prevshift[randomNum], "n"]);
        }
        goBackArray[day] = [];
        usericii = usersTemp;
        index -= 2;
        looper[day] = looper[day] + 1;
        continue;
      }

      shiftn.forEach((User) => {
        for (let user of usericii) {
          if (user == User) user.shifts[day] = "n";
        }
      });

      usericii = usersTemp;
    }
    usericii.sort((a, b) => {
      // Sort by gender first
      if (a.gender < b.gender) return -1;
      if (a.gender > b.gender) return 1;

      // If gender is the same, sort by name
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;

      return 0; // names are equal
    });
    $users = usericii;
  }
  const reset = () => {
    $users = $users.map((user) => ({
      ...user,
      shifts: [""],
      score: 0,
      offDays: [],
    }));
  };
  function removeUser(id: number) {
    $users = $users.filter((user) => user.id !== id);
    $users = $users.map((user) => (user.id > id ? { ...user, id: user.id - 1 } : user));
    localStorage.setItem("users", JSON.stringify($users));
  }
  const addUser = () => {
    // Update the users array
    open = false;
    users.update((users) => {
      users.push({
        id: users.length + 1,
        name: name,
        email: email,
        phone: phone,
        gender: gender,
        offDays: {} as Record<number, boolean>,
        score: 0,
        shifts: [""],
        days: 0,
        nights: 0,
      });
      $users = $users.map((user) => ({
        ...user,
        score: 0,
        shifts: [""],
        days: 0,
        nights: 0,
      }));
      localStorage.setItem("users", JSON.stringify($users));
      return users;
    });
  };
  function handleDateChange(event: any) {
    const selectedDate = event.detail.value;
    currentMonth = dayjs()
      .set("month", selectedDate.month - 1)
      .set("year", selectedDate.year)
      .set("day", 1);
  }
  function handlePerShift(event: any) {
    console.log("sdjsidasjd");
    perShift = event.detail;
    console.log(event);
    localStorage.setItem("pershift", JSON.stringify(perShift));
  }

  function importSchedule(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[][] = utils.sheet_to_json(sheet, { header: 1 });
      if (rows.length < 2) return;
      const header = rows[0];
      const days = header.length - 1;
      const imported: User[] = [];
      rows.slice(1).forEach((row, idx) => {
        const name = row[0] ?? `User ${idx + 1}`;
        const existing = $users.find((u) => u.name === name);
        const shifts: string[] = new Array(days + 1).fill("-");
        const offDays: Record<number, boolean> = {};
        for (let i = 1; i <= days; i++) {
          const val = String(row[i] ?? "-").toLowerCase();
          if (val === "d") shifts[i] = "d";
          else if (val === "n") shifts[i] = "n";
          else if (val === "x" || val === "off") {
            offDays[i - 1] = true;
            shifts[i] = "-";
          } else {
            shifts[i] = val || "-";
          }
        }
        imported.push({
          id: existing ? existing.id : idx + 1,
          name,
          email: existing ? existing.email : "",
          phone: existing ? existing.phone : "",
          gender: existing ? existing.gender : "male",
          offDays,
          score: 0,
          days: 0,
          nights: 0,
          shifts: shifts as [string]
        });
      });
      users.set(imported);
      localStorage.setItem("users", JSON.stringify(imported));
      input.value = "";
    };
    reader.readAsArrayBuffer(file);
  }

  function exportSchedule() {
    const header = ["Name", ...Array.from({ length: daysInMonth.length }, (_, i) => i + 1)];
    const data: any[][] = [header];
    $users.forEach((user) => {
      const row: any[] = [user.name];
      for (let i = 1; i <= daysInMonth.length; i++) {
        if (user.offDays && user.offDays[i - 1]) row.push("x");
        else row.push(user.shifts[i] ?? "-");
      }
      data.push(row);
    });
    const worksheet = utils.aoa_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Schedule");
    const wbout = write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "schedule.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
</script>

<div class="print flex flex-col sm:flex-row justify-between">
  <Button class="print sm:w-1/4" on:click={reset}>Reset</Button>
  <div class="print">
    <DateTime on:change={handleDateChange}></DateTime>
  </div>
  <div class="print">
    <Numberinput value={perShift} on:change={handlePerShift}></Numberinput>
  </div>
  <div class="print flex items-center">
    <input
      type="file"
      accept=".xls,.xlsx"
      bind:this={fileInput}
      on:change={importSchedule}
      class="hidden"
    />
    <Button on:click={() => fileInput.click()} class="print">Import Schedule</Button>
  </div>
</div>
<div class="print">
  <Dialog.Root {open}>
    <Dialog.Trigger on:click={() => (open = true)}><Button variant="outline">Add User</Button></Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Add a new user</Dialog.Title>
      </Dialog.Header>

      <Input bind:value={name} placeholder="Name" />
      <Input bind:value={email} placeholder="Email" />
      <Input bind:value={phone} placeholder="Phone" />
      <RadioGroup.Root bind:value={gender}>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="male" id="r1" />
          <Label for="r1">Male</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="female" id="r2" />
          <Label for="r2">Female</Label>
        </div>
      </RadioGroup.Root>
      <Dialog.Footer>
        <Button on:click={addUser} variant="default">Add User</Button>
        <Button on:click={addUser} variant="destructive">Cancel</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
  <Dialog.Root {$possible} open={$possible} on:blur={console.log("dsdsdsd")} on:close={console.log("dsdsdsd")}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title onblur={() => ($possible = false)}>Message</Dialog.Title>
      </Dialog.Header>
      <p>Not possible</p>
      <Dialog.Footer>
        <button on:blur={() => ($possible = false)} tabindex={-1} style="display: none;">Focusable Element</button>
        <Button on:click={() => ($possible = false)}>Close</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>
<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Shifts for {currentMonth.format("MMMM YYYY")}
</h1>
<p class="leading-7 [&:not(:first-child)]:mt-6 print">
  maximum days of overtime: {maxDaysOvertime}
</p>

{#if $users.length > 0}
  <Table.Root style="width: 100%;">
    <Table.Caption>A list of all the shifts</Table.Caption>
    <Table.Header>
      <Table.Row class="border-b border-black h-1">
        <Table.Head>Name</Table.Head>
        {#each daysInMonth as day (day)}
          <Table.Head>{day.format("D")}</Table.Head>
        {/each}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each $users as user (user.id)}
        <!-- Accessing users from store using $ -->
        <Table.Row class="border-b border-black h-1 ">
          <Table.Cell class="min-w-full">
            <HoverCard.Root>
              <HoverCard.Trigger>
                <div style="display: flex; flex-direction: row; align-items: center; " class="max-w-12 h-8">
                  <p class="w-12 text-xs" style="word-wrap: break-word;">
                    {user.name}
                  </p>
                  <button class="print" on:click={() => removeUser(user.id)}><X></X></button>
                </div></HoverCard.Trigger
              >
              <HoverCard.Content>
                <div class="print">
                  <strong>{user.name}</strong>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Gender: {user.gender}</p>
                </div>
              </HoverCard.Content>
            </HoverCard.Root>
          </Table.Cell>
          {#each daysInMonth as day, i (i)}
            <Table.Cell
              class="min-w-2 printer-cell"
              style="background: {day.day() === 0 || day.day() === 6 || holiday[i + 1]
                ? 'gray'
                : 'transparent'}; max-width: 3px;"
            >
              <button
                on:click={(event) => handleChange(user, day, event)}
                style="background: transparent; max-width: 20px;"
              >
                {#if user.shifts && user.shifts.length > 20}
                  <span style="color: black; max-width:20px;">{user.shifts[i + 1]}</span>
                {:else if user.offDays[day.date() - 1]}
                  <span class="flex items-center justify-center -ml-2" style="color: red;"><X></X></span>
                {:else}
                  <span class="flex items-center justify-center -ml-2" style="color: green;"><Check></Check></span>
                {/if}
              </button></Table.Cell
            >
          {/each}
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
{/if}
<div class="flex gap-2 print">
  <Button on:click={() => generateSched()}>Generate Schedule</Button>
  <Button on:click={exportSchedule}>Export Schedule</Button>
</div>
