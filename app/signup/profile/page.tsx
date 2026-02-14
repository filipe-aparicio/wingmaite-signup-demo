'use client';

import SignupStepShell from '@/app/components/signup/signup-step-shell';
import Button from '@/app/components/ui/button';
import Checkbox from '@/app/components/ui/checkbox';
import Input from '@/app/components/ui/input';
import { useLocalStorage } from '@/lib/use-local-storage';
import { cn } from '@/lib/utils';
import { Field, Fieldset, Form, Toast } from '@base-ui/react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import z from 'zod';

const initialProfileData = {
  firstName: '',
  lastName: '',
  optIn: false,
};

export default function Page() {
  const router = useRouter();
  const toast = Toast.useToastManager();
  const [errors, setErrors] = useState<Form.Props['errors']>({});
  const [profileData, saveProfileData] = useLocalStorage(
    'signup-profile-data',
    initialProfileData,
  );

  const formSchema = z.object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required')
      .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Please enter a valid name'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required')
      .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Please enter a valid name'),
  });

  const submitForm = (formValues: Form.Values) => {
    const result = formSchema.safeParse(formValues);

    if (!result.success) {
      const flattenedError = z.flattenError(result.error);
      const firstError =
        Object.values(flattenedError.fieldErrors).find(
          errors => errors && errors.length > 0,
        )?.[0] ?? 'Please fill in all required fields';

      toast.add({
        title: firstError,
        type: 'alert',
        timeout: 3000,
      });
      return { errors: z.flattenError(result.error).fieldErrors };
    }

    router.push('/signup/finish');
    return {
      errors: {},
    };
  };

  const hasNameErrors = Boolean(
    errors?.firstName?.length || errors?.lastName?.length,
  );

  return (
    <SignupStepShell
      title="Your profile"
      description="Tell us a little about yourself"
    >
      <Form
        errors={errors}
        onFormSubmit={formValues => {
          const response = submitForm(formValues);
          setErrors(response.errors);
        }}
        className="space-y-6"
      >
        <Fieldset.Root className="flex flex-col gap-2.5">
          <Fieldset.Legend
            className={cn(
              'text-pine-950',
              hasNameErrors && 'text-scarlet-700/80',
            )}
          >
            Name
          </Fieldset.Legend>
          <div className="flex w-full gap-3">
            <Field.Root name="firstName" className="w-full">
              <Input
                className="w-full"
                placeholder="First name"
                value={profileData.firstName}
                onValueChange={value =>
                  saveProfileData(prev => ({ ...prev, firstName: value }))
                }
              />
            </Field.Root>
            <Field.Root name="lastName" className="w-full">
              <Input
                className="w-full "
                placeholder="Last name"
                value={profileData.lastName}
                onValueChange={value =>
                  saveProfileData(prev => ({ ...prev, lastName: value }))
                }
              />
            </Field.Root>
          </div>
        </Fieldset.Root>
        <Field.Root name="optIn">
          <Checkbox
            checked={profileData.optIn}
            onCheckedChange={checked =>
              saveProfileData(prev => ({ ...prev, optIn: checked }))
            }
            label="Keep me updated with product offers and updates via email"
          />
        </Field.Root>
        <div className="flex justify-end">
          <Button type="submit" variant="success" className="w-full sm:w-fit">
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      </Form>
    </SignupStepShell>
  );
}
