# 1. Understand The Purpose of the Prototype

## Purpose

It is to test the look and feel and functionality if it is what they want. 

## Audience

The staekholder is someone who isn't technical but will get someone who is technical to look at.

## Feedback

I want feedback on if we are in the right direction, if this is something they are looking for and this is a product they would use. And then pivot as needed based on feedback.

# 2. Choose the Prototype Type

## Type: High-fidelity (Functional Prototype)

This is focused on being a real demo like with real/mock data, minimal backend just to show it off. 

## Tech Stack

Doing this in React, and whatever backend I decide.

## Purpose

To show off ot the ifnal stakeholder as a demo to get and show it ifeels and to get their feedback.

# 3. Design the User Flow

## Scope

Focused on building only what the non-technical stakeholder would feel from this product.
1. Login (stub → 2) Dashboard (my work + status counts → 3) Control detail (test plan + evidence + findings → 4) New Test Request (3-step wizard → 5) Findings review (approve/assign)
2. Keep all data mocked in-memory; no real auth.

## Success Criteria (demo)

- Smooth navigation across the 5 screens.
- Realistic seed data + filters/sorting
- Creating a new Test Request -> see it appear on Dashboard -> open it.
- Mark a Finding "Resolved" -> see status updates everywhere.

## Architecture

- React + Vite + TypeScript
- Tailwind for fast, clean UI
- React Router for Pages
- Mock API

## Database Entities

- User { id, name, role }
- Control { id, name, framework, owner, risk, status }
- TestPlan { id, controlId, steps[], dueDate, assignee }
- Evidence { id, controlId, title, link|blobRef, uploadedBy, uploadedAt }
- Finding { id, controlId, severity, title, description, status, owner, createdAt }
- TestRequest { id, controlId, requestedBy, scope, dueDate, status }

## Statuses

- Control: Draft | In Testing | Passed | Failed | Needs Evidence
- Finding: Open | In Review | Resolved | Accepted Risk
- TestRequest: Pending | In Progress | Complete 