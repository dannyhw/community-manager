import type { ComponentType } from 'react'
import type { ThemeTokens } from '../system/tokens'

export type FieldType = 'text' | 'textarea' | 'select' | 'image'

export interface TemplateField {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: Array<{ value: string; label: string }>
}

export type AspectRatio = '1:1' | '16:9' | '4:5' | '9:16' | '3:2' | 'custom'

export interface TemplateValues {
  [key: string]: string
}

export interface GraphicTemplate {
  id: string
  name: string
  description: string
  aspect: AspectRatio
  width: number
  height: number
  fields: Array<TemplateField>
  defaults: TemplateValues
  Component: ComponentType<{ values: TemplateValues; t: ThemeTokens }>
}
