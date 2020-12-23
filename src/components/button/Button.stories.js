import React from 'react'
import Button from './Button'

export default { title: 'Button' }

export const primary = () => <Button primary label="Button" />

export const success = () => <Button success label="Button" />

export const info = () => <Button info label="Button" />

export const warning = () => <Button warning label="Button" />

export const danger = () => <Button danger label="Button" />

export const fluid = () => <Button primary fluid label="Fluid Button" />

export const loading = () => <Button primary loading label="Button" />