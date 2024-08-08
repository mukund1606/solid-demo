import { useNavigate } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";

import { cn } from "~/lib/utils";

import { type CustomFormData, type Data, DataSchema } from "~/types";

export default function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = createStore<CustomFormData<Data>>({
    values: {
      name: "",
      roomId: "",
    },
    errors: {},
    showErrors: false,
  });

  createEffect(() => {
    const name = localStorage.getItem("name");
    if (name) setFormData("values", "name", name);
  });

  createEffect(() => {
    const data = formData.values;
    const result = DataSchema.safeParse(data);
    if (!result.success) {
      const errors = result.error.issues.reduce(
        (acc, curr) => {
          const key = curr.path[0] as keyof Data;
          acc[key] = curr.message;
          return acc;
        },
        {} as Record<keyof Data, string>,
      );
      setFormData("errors", "roomId", errors.roomId);
      setFormData("errors", "name", errors.name);
      setFormData("areErrors", true);
      return;
    }
    setFormData("errors", "name", undefined);
    setFormData("errors", "roomId", undefined);
    setFormData("areErrors", false);
  });

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    if (!formData.showErrors) setFormData("showErrors", true);
    if (formData.areErrors) return;
    const data = DataSchema.parse(formData.values);
    localStorage.setItem("name", data.name);
    navigate(`/room/${data.roomId}`);
  }

  return (
    <div class="flex min-h-[100dvh] flex-col">
      <div class="mx-auto my-auto flex gap-2 p-2">
        <Card class="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>Enter Room</CardTitle>
          </CardHeader>
          <form onSubmit={handleFormSubmit} class="w-full">
            <CardContent class="flex flex-col gap-4">
              {/* Room ID */}
              <TextField
                class={cn(
                  formData.errors?.roomId &&
                    formData.showErrors &&
                    "text-destructive",
                )}
              >
                <TextFieldLabel for="form-room-id">Room ID</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  id="form-room-id"
                  value={formData.values.roomId}
                  onInput={(e) => {
                    setFormData("values", "roomId", e.currentTarget.value);
                  }}
                  class={cn(
                    formData.errors?.roomId &&
                      formData.showErrors &&
                      "placeholder:text-destructive",
                  )}
                  placeholder="Enter Room ID"
                />
                <Show when={formData.errors?.roomId && formData.showErrors}>
                  <p class="text-sm">{formData.errors?.roomId}</p>
                </Show>
              </TextField>
              {/* Name */}
              <TextField
                class={cn(
                  formData.errors?.name &&
                    formData.showErrors &&
                    "text-destructive",
                )}
              >
                <TextFieldLabel for="form-name">Your Name</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  id="form-name"
                  value={formData.values.name}
                  onInput={(e) => {
                    setFormData("values", "name", e.currentTarget.value);
                  }}
                  class={cn(
                    formData.errors?.name &&
                      formData.showErrors &&
                      "placeholder:text-destructive",
                  )}
                  placeholder="Enter Your Name"
                />
                <Show when={formData.errors?.name && formData.showErrors}>
                  <p class="text-sm">{formData.errors?.name}</p>
                </Show>
              </TextField>
            </CardContent>
            <CardFooter class="flex flex-col">
              <Button type="submit" class="w-full font-semibold">
                Join Room
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
