import { Heading, Text } from "@/components/ui/typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <section className="space-y-4">
        <Heading variant="h1">MinimalMind</Heading>
        <Text variant="lead">
          A beautiful, minimal app to organize your thoughts, tasks, and notes.
        </Text>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button asChild>
            <Link href="/todo">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/notebook">Explore</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Beautiful Typography</CardTitle>
            <CardDescription>
              Using Poppins and JetBrains Mono for a clean, professional look
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Heading variant="h2">Headings</Heading>
              <Heading variant="h3">Look clean and professional</Heading>
              <Heading variant="h4">With consistent spacing</Heading>
            </div>
            <div className="space-y-2">
              <Text>Default paragraph text with good readability</Text>
              <Text variant="subtle">Subtle text for less emphasis</Text>
              <Text variant="mono">Monospaced text for code</Text>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Font Features</CardTitle>
            <CardDescription>
              Optimized for readability and aesthetics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Text weight="bold">Bold text for emphasis</Text>
              <Text weight="semibold">Semi-bold for sub-headings</Text>
              <Text weight="medium">Medium weight for balanced emphasis</Text>
              <Text weight="regular">Regular weight for body text</Text>
            </div>
            <div>
              <Text variant="mono">
                font-feature-settings: &quot;liga&quot; 1;
                <br />
                font-feature-settings: &quot;calt&quot; 1;
              </Text>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
