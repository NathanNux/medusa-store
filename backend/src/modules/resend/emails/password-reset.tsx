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

type PasswordResetEmailProps = {
  reset_url: string
  email?: string
}

function PasswordResetEmailComponent({ reset_url, email }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Zresetujte své heslo</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Zresetujte své heslo
              </Heading>
            </Section>

            <Section className="my-[32px]">
              <Text className="text-black text-[14px] leading-[24px]">
                Dobrý den,{email ? ` ${email}` : ""},
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                Obdrželi jsme žádost o resetování vašeho hesla. Klikněte na tlačítko níže a vytvořte si nové heslo pro svůj účet.
              </Text>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={reset_url}
              >
                Zresetujte heslo
              </Button>
            </Section>

            <Section className="my-[32px]">
              <Text className="text-black text-[14px] leading-[24px]">
                Nebo zkopírujte a vložte tuto adresu URL do svého prohlížeče:
              </Text>
              <Link
                href={reset_url}
                className="text-blue-600 no-underline text-[14px] leading-[24px] break-all"
              >
                {reset_url}
              </Link>
            </Section>

            <Section className="my-[32px]">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                Tento odkaz pro resetování hesla brzy vyprší z bezpečnostních důvodů.
              </Text>
              <Text className="text-[#666666] text-[12px] leading-[24px] mt-2">
                Pokud jste o resetování hesla nežádali, můžete tento e-mail bezpečně ignorovat. Vaše heslo zůstane nezměněno.
              </Text>
            </Section>

            <Section className="mt-[32px] pt-[20px] border-t border-solid border-[#eaeaea]">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                Z bezpečnostních důvodů nikdy nesdílejte tento odkaz na resetování s nikým. Pokud máte potíže s tlačítkem výše, zkopírujte a vložte adresu URL do svého webového prohlížeče.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export const passwordResetEmail = (props: PasswordResetEmailProps) => (
  <PasswordResetEmailComponent {...props} />
)

// Mock data for preview/development
const mockPasswordReset: PasswordResetEmailProps = {
  reset_url: "https://your-app.com/reset-password?token=sample-reset-token-123",
  email: "user@example.com",
}

export default () => <PasswordResetEmailComponent {...mockPasswordReset} />