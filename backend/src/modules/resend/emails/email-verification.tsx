import {
  Text,
  Container,
  Heading,
  Html,
  Section,
  Tailwind,
  Head,
  Preview,
  Body,
  Link,
  Button,
} from "@react-email/components"

type EmailVerificationProps = {
  verification_url: string
  email?: string
}

function EmailVerificationComponent({ verification_url, email }: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Potvrďte svou e-mailovou adresu</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Potvrďte svou e-mailovou adresu
              </Heading>
            </Section>
            <Section className="my-[32px]">
              <Text className="text-black text-[14px] leading-[24px]">
                Dobrý den,{email ? ` ${email}` : ""},
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                Potvrďte svou e-mailovou adresu kliknutím na tlačítko níže.
              </Text>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={verification_url}
              >
                Potvrďte e-mail
              </Button>
            </Section>
            <Section className="my-[32px]">
              <Text className="text-black text-[14px] leading-[24px]">
                Nebo zkopírujte a vložte tuto adresu URL do svého prohlížeče:
              </Text>
              <Link
                href={verification_url}
                className="text-blue-600 no-underline text-[14px] leading-[24px] break-all"
              >
                {verification_url}
              </Link>
            </Section>
            <Section className="my-[32px]">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                Pokud jste tuto žádost o ověření e-mailu neodeslali vy, můžete tento e-mail bezpečně ignorovat.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export const emailVerificationEmail = (props: EmailVerificationProps) => (
  <EmailVerificationComponent {...props} />
)

// Mock data for preview/development
const mockVerification: EmailVerificationProps = {
  verification_url: "https://your-app.com/verify-email?token=sample-verification-token-123",
  email: "user@example.com",
}

export default () => <EmailVerificationComponent {...mockVerification} />