import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Users, TrendingUp, MessageCircle, BookOpen, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full mb-6">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Student Wellness
              <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Assessment Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered mental health support for Rwandan students. Get personalized assessments, resources, and
              connect with local mental health professionals when you need them most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 px-8 py-3 text-lg"
                >
                  Start Your Assessment
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-teal-600 border-teal-200 hover:bg-teal-50 px-8 py-3 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Mental Health Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI technology with human expertise to provide personalized mental health support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-teal-50 to-blue-50">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Advanced AI analyzes your text to detect mental health conditions and assess risk levels
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-green-50">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                <p className="text-gray-600">
                  Get personalized risk evaluations and appropriate recommendations based on your needs
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-teal-50">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Professionals</h3>
                <p className="text-gray-600">
                  Connect with verified mental health professionals and clinics across Rwanda
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your mental wellness journey with detailed analytics and progress reports
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How SWAP Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to get the mental health support you need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Share Your Feelings</h3>
              <p className="text-gray-600 text-lg">
                Write about how you're feeling in a safe, confidential environment. Our AI will analyze your text to
                understand your mental state.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Get AI Analysis</h3>
              <p className="text-gray-600 text-lg">
                Receive instant analysis of your mental health conditions, risk level, and wellness score powered by
                advanced AI technology.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Get Support</h3>
              <p className="text-gray-600 text-lg">
                Access personalized resources for low-risk situations, or connect with local mental health professionals
                for critical cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about SWAP? We're here to help you on your wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+250 788 123 456</p>
                <p className="text-sm text-gray-500 mt-2">24/7 Crisis Support</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@swap.rw</p>
                <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">Kigali, Rwanda</p>
                <p className="text-sm text-gray-500 mt-2">Serving all of Rwanda</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">SWAP</span>
          </div>
          <p className="text-gray-400 mb-4">
            Student Wellness Assessment Platform - Supporting Rwandan students' mental health
          </p>
          <p className="text-sm text-gray-500">© 2024 SWAP. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  )
}
